// File: backend/services/groqService.js
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Chế độ ăn trên UI là tiếng Việt nhưng prompt là tiếng Anh nên phải dịch trước
const DIET_EN = {
  "ăn mặn": "non-vegetarian (meat or fish)",
  "ăn chay": "vegetarian (no meat, no fish)",
};

// Schema ép khuôn JSON. strict: true => Groq dùng constrained decoding,
// luôn trả về JSON đúng shape nên không còn lỗi 400 json_validate_failed
const RECIPE_SCHEMA = {
  type: "object",
  properties: {
    dishName: {
      type: "string",
      description: "Exact name of the real, existing dish (e.g., 'Spaghetti Carbonara', 'Pad Thai', 'Beef Bourguignon')",
    },
    calories: {
      type: "string",
      description: "Estimated calories (e.g., 450 kcal)",
    },
    instructions: {
      type: "array",
      description: "Exactly 5 detailed cooking steps, in English",
      items: { type: "string" },
    },
  },
  required: ["dishName", "calories", "instructions"],
  additionalProperties: false,
};

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: { name: "recipe", strict: true, schema: RECIPE_SCHEMA },
};

const callGroqRecipe = async (ingredients, diet, maxRetries = 3) => {
  let attempt = 0;
  let delay = 2000;

  const systemPrompt = `You are a Michelin-starred chef and expert nutritionist. 
  Your task is to identify a REAL, WELL-KNOWN, and POPULAR dish that uses the provided ingredients. 
  DO NOT invent, hallucinate, or create a new dish. The dish MUST be an authentic, existing recipe that has many tutorials on YouTube and TikTok.
  
  The 'instructions' array MUST contain EXACTLY 5 comprehensive and descriptive steps.
  Each element of 'instructions' describes ONE single step - never combine several steps into one string.
  The dish name, the calories and every step MUST be written in ENGLISH.`;

  // CẬP NHẬT USER PROMPT
  const userPrompt = `Find the most famous, REAL-WORLD dish suitable for a '${DIET_EN[diet] || diet}' diet that can be made using mostly these ingredients: ${ingredients.join(', ')}. 
  Remember, it MUST be an existing traditional or famous dish, NOT a generated one. Return the detailed recipe in EXACTLY 5 steps.`;

  // Bao bọc toàn bộ bằng vòng lặp Retry
  while (attempt < maxRetries) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: "openai/gpt-oss-20b", 
        response_format: RESPONSE_FORMAT, 
        temperature: 0.3, // GIẢM TEMPERATURE XUỐNG
        // Mặc định của Groq chỉ 1024 token: model reasoning hết chỗ thì content rỗng
        // và Groq báo 400 json_validate_failed. Cần đủ chỗ cho 5 bước chi tiết.
        max_completion_tokens: 2048,
        // reasoning_effort low: để model dồn token cho phần trả lời, không nghĩ quá nhiều
        reasoning_effort: "low",
      });

      return chatCompletion.choices[0].message.content;

    } catch (error) {
      attempt++;
      console.warn(`[Cảnh báo] Lỗi gọi Groq (lần thử ${attempt}/${maxRetries}):`, error.message);

      // Bắt lỗi 429 (Too Many Requests), 5xx, hoặc 400 json_validate_failed
      // (model sinh JSON sai schema -> thử lại thường được)
      const isJsonValidationError =
        error.status === 400 && error.error?.code === 'json_validate_failed';
      if ((error.status === 429 || error.status >= 500 || isJsonValidationError) && attempt < maxRetries) {
        console.log(`⏳ Bếp trưởng Groq đang kẹt đơn. Đang đợi ${delay / 1000}s để gọi lại...`);
        await sleep(delay);
        delay *= 2; // Gấp đôi thời gian chờ
      } else {
        throw error;
      }
    }
  }
};

module.exports = { callGroqRecipe, RECIPE_SCHEMA, RESPONSE_FORMAT };