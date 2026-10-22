require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { SchemaType } = require('@google/generative-ai');
const { callGeminiWithRetry } = require('./services/geminiService');
const { callGroqRecipe } = require('./services/groqService');

const app = express();

// CORS mở hoàn toàn để app chạy được trên mọi máy (điện thoại, máy khác trong LAN)
app.use(cors());

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
    // 1. System Instruction: Ép buộc tuyệt đối bằng lệnh cấm
    const systemInstruction = "You are an expert computer vision AI. Your task is to accurately identify the cooking ingredients present in the image. YOU MUST NAME THEM STRICTLY IN ENGLISH. DO NOT USE VIETNAMESE OR ANY OTHER LANGUAGE.";
    
    const prompt = `
      Analyze this image and identify all the food ingredients visible.
      CRITICAL REQUIREMENTS:
      1. You MUST return the ingredient names strictly in ENGLISH.
      2. Return ONLY a plain JSON array of strings. 
      3. Do not include markdown formatting like \`\`\`json, and do not add any extra text or explanations.
      
      Example output format:
      ["egg", "carrot", "avocado", "orange juice"]
  ` ;

    // 2. Schema: Cập nhật description để định hướng JSON
    const schema = {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of ingredient names in English" 
    };

    const imagePart = { inlineData: { data: imageBase64, mimeType } };
    
    const result = await callGeminiWithRetry(prompt, imagePart, systemInstruction, schema);
    
    const jsonString = result.response.text();

    console.log("\n👁️ === KẾT QUẢ TỪ GEMINI (QUÉT ẢNH) ===");
    console.log(jsonString);

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

    const recipe = parseModelJson(jsonString);
    if (!recipe || typeof recipe !== 'object' || !Array.isArray(recipe.instructions)) {
      throw Object.assign(new Error("Groq không trả về công thức đúng định dạng"), { status: 502 });
    }

    // Link tìm video nấu món: tự build từ tên món để chắc chắn hợp lệ
    const dish = encodeURIComponent(String(recipe.dishName || "").trim());
    res.json({
      ...recipe,
      youtubeLink: `https://www.youtube.com/results?search_query=how+to+cook+${dish}`,
      tiktokLink: `https://www.tiktok.com/search?q=how+to+cook+${dish}`,
    });

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
