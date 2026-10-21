require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SchemaType } = require('@google/generative-ai');
const { callGeminiWithRetry } = require('./services/geminiService');
const { callGroqRecipe } = require('./services/groqService');

const app = express();

const whitelist = [
  'http://localhost:5173', // Dành cho lúc bạn code trên máy
  'http://127.0.0.1:5173', // NẾU SAU NÀY BẠN ĐƯA LÊN MẠNG THÌ BỎ COMMENT DÒNG NÀY VÀ THÊM LINK VÀO
];

// Origin rỗng (Postman, curl) thì vẫn cho qua
const isAllowedOrigin = (origin) => !origin || whitelist.includes(origin);

const corsOptions = {
  origin: function (origin, callback) {
    // Origin lạ: không set header CORS, request sẽ bị chặn 403 ở middleware bên dưới
    callback(null, isAllowedOrigin(origin));
  },
  methods: ['GET', 'POST'], // Chỉ cho phép phương thức đọc và gửi
  optionsSuccessStatus: 200
};

// Áp dụng ổ khóa CORS mới
app.use(cors(corsOptions));

// Chặn origin lạ TRƯỚC khi gọi AI (không đốt quota, trả 403 JSON)
app.use((req, res, next) => {
  if (!isAllowedOrigin(req.headers.origin)) {
    return res.status(403).json({ error: "Bị chặn bởi chính sách CORS của Let's Cook!" });
  }
  next();
});

// Quan trọng: Mở rộng giới hạn dung lượng vì ảnh Base64 rất nặng
app.use(express.json({ limit: '50mb' }));

// Parse JSON do AI trả về. JSON hỏng là lỗi phía upstream (502) chứ không phải lỗi server
const parseModelJson = (raw) => {
  try {
    return JSON.parse(raw);
  } catch {
    throw Object.assign(new Error("AI trả về JSON không hợp lệ"), { status: 502 });
  }
};

// ==========================================
// API 1: QUÉT ẢNH TÌM NGUYÊN LIỆU
// ==========================================
app.post('/api/analyze-image', async (req, res) => {
  const { imageBase64, mimeType } = req.body || {};

  // Kiểm tra dữ liệu đầu vào trước khi gọi AI
  if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
    return res.status(400).json({ error: "Bạn hãy chọn 1 tấm ảnh tượng trưng nhé!" });
  }
  if (typeof mimeType !== 'string' || !mimeType.startsWith('image/')) {
    return res.status(400).json({ error: "Định dạng ảnh không hợp lệ!" });
  }

  try {
    // 1. System Instruction: Trợ lý thị giác
    const systemInstruction = "Bạn là một AI chuyên gia thị giác máy tính. Nhiệm vụ của bạn là nhận diện chính xác các nguyên liệu nấu ăn có trong ảnh và gọi tên chúng bằng tiếng Việt.";
    
    const prompt = "Liệt kê các nguyên liệu nấu ăn bạn thấy trong ảnh này.";
    
    // 2. Schema: Ép khuôn thành Mảng các Chuỗi
    const schema = {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Danh sách tên các nguyên liệu"
    };

    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    
    const result = await callGeminiWithRetry(prompt, imagePart, systemInstruction, schema);
    
    const jsonString = result.response.text();

    console.log("\n👁️ === KẾT QUẢ TỪ GEMINI (QUÉT ẢNH) ===");
    console.log(jsonString);
    console.log("=========================================\n");

    const ingredients = parseModelJson(jsonString);
    if (!Array.isArray(ingredients)) {
      throw Object.assign(new Error("Gemini không trả về danh sách nguyên liệu"), { status: 502 });
    }

    res.json({ ingredients });

  } catch (error) {
    console.error("Lỗi Quét ảnh:", error);
    if (error.status === 503) return res.status(503).json({ error: "Mắt AI đang mỏi, thử lại nhé!" });
    if (error.status === 502) return res.status(502).json({ error: "AI trả về dữ liệu lỗi, thử lại nhé!" });
    res.status(500).json({ error: "Lỗi nhận diện nguyên liệu" });
  }
});

// ==========================================
// API 2: TẠO CÔNG THỨC TỪ NGUYÊN LIỆU
// ==========================================
app.post('/api/generate-recipe', async (req, res) => {
  const { finalIngredients, diet } = req.body || {};

  // Kiểm tra dữ liệu đầu vào trước khi gọi AI
  const ingredientsAreValid =
    Array.isArray(finalIngredients) &&
    finalIngredients.length > 0 &&
    finalIngredients.every((item) => typeof item === 'string' && item.trim());
  if (!ingredientsAreValid) {
    return res.status(400).json({ error: "Hãy chọn ít nhất 1 nguyên liệu hợp lệ!" });
  }
  if (typeof diet !== 'string' || !diet.trim()) {
    return res.status(400).json({ error: "Thiếu chế độ ăn (ăn mặn / ăn chay)!" });
  }

  try {
    // Chỉ cần gọi hàm service của Groq, không cần truyền Schema phức tạp như Gemini nữa
    const jsonString = await callGroqRecipe(finalIngredients, diet); 
    
    console.log("\n👨‍🍳 === KẾT QUẢ TỪ GROQ (LÊN THỰC ĐƠN) ===");
    console.log(jsonString);
    console.log("=========================================\n");

    const recipe = parseModelJson(jsonString);
    if (!recipe || typeof recipe !== 'object' || !Array.isArray(recipe.instructions)) {
      throw Object.assign(new Error("Groq không trả về công thức đúng định dạng"), { status: 502 });
    }

    // Trả thẳng kết quả JSON về cho Frontend
    res.json(recipe);

  } catch (error) {
    console.error("Lỗi Nấu ăn:", error);
    if (error.status === 502) return res.status(502).json({ error: "Bếp trưởng Groq trả về dữ liệu lỗi, thử lại nhé!" });
    res.status(500).json({ error: "Bếp trưởng Groq đang bận!" });
  }
});

// ==========================================
// Bắt lỗi chung (JSON hỏng, lỗi ngoài dự kiến): trả JSON, không lộ stack trace
// ==========================================
app.use((err, req, res, next) => {
  console.error("Lỗi server:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 400 ? "Dữ liệu gửi lên không hợp lệ" : "Lỗi máy chủ"
  });
});

const PORT = process.env.PORT || 5000;

// Chỉ tự chạy server khi gọi trực tiếp (node server.js) để test có thể import app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Backend Let's Cook đang chạy tại http://localhost:${PORT}`);
  });
}

module.exports = { app, parseModelJson };
