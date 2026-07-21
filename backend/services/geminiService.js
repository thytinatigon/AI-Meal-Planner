const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGeminiWithRetry = async (prompt, imageData, systemInstruction, schema, maxRetries = 2) => {
  let attempt = 0;
  let delay = 5000;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash-lite",
    systemInstruction: systemInstruction 
  });

  // Bật chế độ ép kiểu JSON Native
  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: schema, 
  };

  const parts = [{ text: prompt }];
  if (imageData) parts.push(imageData); 

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig
      });
      return result;
      
    } catch (error) {
      attempt++;
      console.warn(`[Cảnh báo] Lỗi gọi Gemini (lần thử ${attempt}/${maxRetries}):`, error.message);

      if ((error.status === 503 || error.status === 429) && attempt < maxRetries) {
        console.log(`⏳ Đang đợi ${delay / 1000}s để thử lại...`);
        await sleep(delay);
        delay *= 2; 
      } else {
        throw error;
      }
    }
  }
};

module.exports = { callGeminiWithRetry };