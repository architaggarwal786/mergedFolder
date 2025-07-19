const express = require("express");
const router = express.Router();
const getChatReply = require("../utils/llm");
const clothesData = require("../utils/clothingData");
const logger = require("../utils/logger");

// Keyword lists & synonyms
const colors = [ "red", "blue", "pink", "black", "white", "grey", "green", "yellow", "purple", "orange", "brown" ];
const types = [ "tshirt", "shirt", "jeans", "kurta", "lehenga", "dress", "gown", "tracksuit", "pant", "shorts", "saree", "coat", "jacket", "bra", "blouse", "accessories" ];
const genders = [ "boys", "girls", "men", "unisex", "women" ];
const usages = [ "casual", "ethnic", "formal", "partywear", "smart casual", "sports", "travel", "summer", "winter", "spring", "fall" ];

const synonymMap = { gown: "dress", blouse: "shirt", panties: "bra", jacket: "coat" };
const allKeywords = [...colors, ...types, ...genders, ...usages];

router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;
  const msg = message.trim().toLowerCase();

  try {
    // Log incoming history for debugging
    logger.info("📥 Incoming history:", history);

    // Build context string
    const chatContext = history
      .filter(e => typeof e.msg === "string" && e.msg.trim())
      .map(e => `${e.sender === "user" ? "User" : "Assistant"}: ${e.msg}`)
      .join("\n");

    if (!chatContext) {
      logger.warn("⚠️ Chat context is empty");
    }

    logger.info(`📝 Prompt context:\n${chatContext}\nUser: ${msg}`);

    // Intent classification prompt
    const intent = (await getChatReply(`
Classify the intent as "casual" or "product_search."

Chat:
${chatContext}
User: ${msg}

Reply with one word: casual or product_search.
    `)).toLowerCase().trim();

    logger.info("🧠 Detected intent:", intent);

    if (intent === "casual") {
      const reply = await getChatReply(`
You are a friendly fashion assistant.

Continue the chat contextually:

${chatContext}
User: ${msg}
Assistant:
      `);
      return res.json({ text: reply });
    }

    // Product search path
    const words = msg.match(/\b\w+\b/g) || [];
    const keywords = words.map(w => synonymMap[w] || w).filter(w => allKeywords.includes(w));
    logger.info("🔍 Keywords extracted:", keywords);

    let matches = [];
    if (keywords.length) {
      matches = clothesData.filter(item => {
        const txt = [item.productDisplayName, item.subType, item.type, item.color, item.usage, item.season, item.gender]
          .join(" ")
          .toLowerCase();
        return keywords.every(kw => txt.includes(kw));
      });
    }

    if (matches.length) {
      return res.json({
        text: `✨ Here are picks matching: ${keywords.join(", ")}`,
        items: matches.slice(0, 4)
      });
    } else {
      const fallback = await getChatReply(`
You are a helpful AI fashion stylist.

User asked: "${msg}"

Provide helpful styling tips.
Assistant:
      `);
      return res.json({ text: fallback });
    }
  } catch (err) {
    logger.error("❌ recommend route error:", err);
    return res.status(500).json({ text: "⚠️ Something went wrong. Please try again." });
  }
});

module.exports = router;
