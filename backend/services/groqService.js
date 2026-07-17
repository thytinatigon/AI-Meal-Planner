// File: backend/services/groqService.js
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Thêm tham số maxRetries vào hàm
const callGroqRecipe = async (ingredients, diet, maxRetries = 3) => {
  let attempt = 0;
  let delay = 2000;

  const systemPrompt = `Bạn là siêu đầu bếp Michelin kiêm chuyên gia dinh dưỡng. 
  Nhiệm vụ của bạn là tạo ra một bữa ăn từ nguyên liệu cho sẵn. 
  BẮT BUỘC TRẢ VỀ ĐỊNH DẠNG JSON CHUẨN NHƯ SAU, KHÔNG KÈM THEO BẤT KỲ VĂN BẢN NÀO KHÁC:
  {
    "dishName": "Tên món ăn",
    "calories": "Lượng calo (ví dụ: 350 kcal)",
    "instructions": ["Bước 1...", "Bước 2...", "Bước 3..."]
  }`;

  const userPrompt = `Hãy tạo 1 món ăn phù hợp với chế độ ${diet} từ các nguyên liệu sau: ${ingredients.join(', ')}. Hãy trả về JSON.`;

  // Bao bọc toàn bộ bằng vòng lặp Retry
  while (attempt < maxRetries) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: "llama-3.1-8b-instant", 
        response_format: { type: "json_object" }, 
        temperature: 0.7, 
      });

      // Nếu thành công, thoát vòng lặp và trả về kết quả
      return chatCompletion.choices[0].message.content;

    } catch (error) {
      attempt++;
      console.warn(`[Cảnh báo] Lỗi gọi Groq (lần thử ${attempt}/${maxRetries}):`, error.message);

      // Bắt lỗi 429 (Too Many Requests) hoặc các lỗi server 5xx từ Groq
      if ((error.status === 429 || error.status >= 500) && attempt < maxRetries) {
        console.log(`⏳ Bếp trưởng Groq đang kẹt đơn. Đang đợi ${delay / 1000}s để gọi lại...`);
        await sleep(delay);
        delay *= 2; // Gấp đôi thời gian chờ
      } else {
        // Hết 3 lần hoặc dính lỗi sai API Key thì ném lỗi ra ngoài
        throw error;
      }
    }
  }
};

module.exports = { callGroqRecipe };