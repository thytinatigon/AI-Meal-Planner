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

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép gọi từ các domain trong whitelist, hoặc các tool như Postman (origin không xác định)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Bị chặn bởi chính sách CORS của Let\'s Cook!'));
    }
  },
  methods: ['GET', 'POST'], // Chỉ cho phép phương thức đọc và gửi
  optionsSuccessStatus: 200
};

// Áp dụng ổ khóa CORS mới
app.use(cors(corsOptions));

// Quan trọng: Mở rộng giới hạn dung lượng vì ảnh Base64 rất nặng
app.use(express.json({ limit: '50mb' })); 

// ==========================================
// API 1: QUÉT ẢNH TÌM NGUYÊN LIỆU
// ==========================================
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    
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

    res.json({ ingredients: JSON.parse(jsonString) });

  } catch (error) {
    console.error("Lỗi Quét ảnh:", error);
    if (error.status === 503) return res.status(503).json({ error: "Mắt AI đang mỏi, thử lại nhé!" });
    res.status(500).json({ error: "Lỗi nhận diện nguyên liệu" });
  }
});

// ==========================================
// API 2: TẠO CÔNG THỨC TỪ NGUYÊN LIỆU
// ==========================================
app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { finalIngredients, diet } = req.body;
    
    // Chỉ cần gọi hàm service của Groq, không cần truyền Schema phức tạp như Gemini nữa
    const jsonString = await callGroqRecipe(finalIngredients, diet); 
    
    console.log("\n👨‍🍳 === KẾT QUẢ TỪ GROQ (LÊN THỰC ĐƠN) ===");
    console.log(jsonString);
    console.log("=========================================\n");

    // Trả thẳng kết quả JSON về cho Frontend
    res.json(JSON.parse(jsonString));

  } catch (error) {
    console.error("Lỗi Nấu ăn:", error);
    res.status(500).json({ error: "Bếp trưởng Groq đang bận!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Let's Cook đang chạy tại http://localhost:${PORT}`);
});