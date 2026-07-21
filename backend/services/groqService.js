// File: backend/services/groqService.js
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGroqRecipe = async (ingredients, diet, maxRetries = 3) => {
  let attempt = 0;
  let delay = 2000;

  // CẬP NHẬT SYSTEM PROMPT
  const systemPrompt = `You are a Michelin-starred chef and expert nutritionist. 
  Your task is to identify a REAL, WELL-KNOWN, and POPULAR dish that uses the provided ingredients. 
  DO NOT invent, hallucinate, or create a new dish. The dish MUST be an authentic, existing recipe that has many tutorials on YouTube and TikTok.
  
  YOU MUST RETURN ONLY A VALID JSON OBJECT. NO EXTRA TEXT OR MARKDOWN OUTSIDE THE JSON. 
  Use the exact JSON structure below. For the 'instructions' array, you MUST write EXACTLY 5 comprehensive and descriptive steps.
  
  {
    "dishName": "Exact name of the real, existing dish (e.g., 'Spaghetti Carbonara', 'Pad Thai', 'Beef Bourguignon')",
    "calories": "Estimated calories (e.g., 450 kcal)",
    "youtubeLink": "https://www.youtube.com/results?search_query=how+to+cook+[dish_name_encoded]",
    "tiktokLink": "https://www.tiktok.com/search?q=how+to+cook+[dish_name_encoded]",
    "instructions": [
      "Detailed preparation... (e.g., washing, mincing, marinating, exact measurements)",
      "Initial cooking phase... (e.g., sautéing aromatics, searing proteins)",
      "Main cooking process... (e.g., simmering, baking, exact heat levels, timing and visual cues)",
      "Finishing touches... (e.g., resting meats, reducing sauces, final seasoning adjustments)",
      "Plating, garnishing, and serving suggestions..."
    ]
  }`;

  // CẬP NHẬT USER PROMPT
  const userPrompt = `Find the most famous, REAL-WORLD dish suitable for a '${diet}' diet that can be made using mostly these ingredients: ${ingredients.join(', ')}. 
  Remember, it MUST be an existing traditional or famous dish, NOT a generated one. Return the detailed recipe in EXACTLY 5 steps. Return ONLY JSON.`;

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
        temperature: 0.3, // GIẢM TEMPERATURE XUỐNG
      });

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
        throw error;
      }
    }
  }
};

module.exports = { callGroqRecipe };