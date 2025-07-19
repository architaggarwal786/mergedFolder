const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getChatReply(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent([{ text: prompt }]);
    const response = await result.response;
    const text = response.text();
    return text.trim();
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    return "⚠️ Gemini is currently unreachable. Try again later.";
  }
}

module.exports = getChatReply;
