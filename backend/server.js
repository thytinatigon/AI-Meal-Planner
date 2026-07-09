const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Bật CORS để Frontend gọi được sang Backend
app.use(cors());

// Quan trọng: Mở rộng giới hạn dung lượng vì ảnh Base64 rất nặng
app.use(express.json({ limit: '50mb' })); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/recipe', async (req, res) => {
  try {
    const { imageBase64, mimeType, diet } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `Hãy nhìn ảnh tủ lạnh này, liệt kê các nguyên liệu và gợi ý 1 món ${diet}. Trả về ĐÚNG định dạng JSON sau, không kèm text thừa: {"dishName": "", "calories": "", "ingredients": [], "instructions": []}`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    // Dọn dẹp cục JSON trả về
    const cleanJson = text.replace(/```json|```/g, "");
    res.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("Lỗi AI:", error);
    res.status(500).json({ error: "Đã có lỗi xảy ra khi xử lý ảnh" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});