 // ✅ Original index.js with chatbot integration for static clothingData

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: false,
}).then(() => console.log('[INFO] ✅ MongoDB connected'))
  .catch(err => console.error('[ERROR] ❌ MongoDB connection failed:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/clothes', require('./routes/clothesRoutes'));
app.use('/api/recommend', require('./routes/recommend'));
app.use('/api/products', require('./routes/products'));

// Models & Gemini setup
const Clothes = require('./models/Clothes');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Load static clothing data
const clothingData = require('./utils/clothingData');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Utility: Convert image URL to base64
async function getBase64FromUrl(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary').toString('base64');
}

// Utility: Extract key-value from Gemini response
function extractDetail(text, key) {
  const match = text.match(new RegExp(`${key}\\s*[:\\-\u2013]\\s*(.+)`, 'i'));
  return match ? match[1].split(/[.,\n]/)[0].trim().toLowerCase() : '';
}

// 🔍 Predict clothing attributes
async function predictClothingAttributes(imageUrl) {
  try {
    const prompt = `You are a fashion expert. Analyze the uploaded clothing image and identify the following:
1. Gender (male/female/unisex)
2. Season (summer/winter/monsoon/all seasons)
3. Type (upper-wear, bottom-wear, full-body, accessory)
4. Subtype (e.g., t-shirt, suit, kurta, lehenga, saree, hoodie, tracksuit, coat, jeans, etc.)
5. Color (main visible color)
6. Style (casual, formal, traditional, sporty, streetwear, partywear, business, ethnic)

Respond in the following format:
Gender: ...
Season: ...
Type: ...
Subtype: ...
Color: ...
Style: ...`;

    const base64Image = await getBase64FromUrl(imageUrl);

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          ],
        },
      ],
    });

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('🧠 Gemini Output:\n', text);

    return {
      gender: extractDetail(text, 'Gender') || 'unisex',
      season: extractDetail(text, 'Season') || 'all seasons',
      type: extractDetail(text, 'Type') || 'upper-wear',
      subType: extractDetail(text, 'Subtype') || 't-shirt',
      color: extractDetail(text, 'Color') || 'unknown',
      style: extractDetail(text, 'Style') || 'casual',
      geminiOutput: text,
    };
  } catch (err) {
    console.error('❌ Gemini Prediction Error:', err);
    return {
      gender: 'unisex',
      season: 'summer',
      type: 'upper-wear',
      subType: 't-shirt',
      color: 'unknown',
      style: 'casual',
      geminiOutput: 'Prediction failed',
    };
  }
}

// ✅ Upload Route
app.post('/upload-clothes', upload.array('images', 10), async (req, res) => {
  try {
   const serverBaseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://mergedfolder.onrender.com'
    : 'http://localhost:5000';

const files = req.files.map((file) => ({
  filename: file.filename,
  path: `${serverBaseUrl}/uploads/${file.filename}`,
}));

    // End of files mapping

    const predictions = await Promise.all(
      files.map(async (file) => {
        const attr = await predictClothingAttributes(file.path);
        return { ...attr, image: file };
      })
    );

    const saved = await Clothes.insertMany(
      predictions.map((item) => ({
        uuid: uuidv4(),
        season: item.season,
        gender: item.gender,
        type: item.type,
        subType: item.subType,
        color: item.color,
        style: item.style,
        geminiOutput: item.geminiOutput,
        uploadedBy: 'user',
        images: [item.image],
      }))
    );

    res.status(201).json({ message: '✅ Upload + Prediction successful', saved });
  } catch (err) {
    console.error('❌ Upload Failed:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// ✅ Clothing-aware chatbot
// app.post('/chatbot', async (req, res) => {
//   const userMessage = req.body.message?.toLowerCase() || '';
//   try {
//     const keywords = userMessage.match(/\b(tshirt|shirt|jeans|kurta|lehenga|dress|tracksuit|pant|saree|coat|watch|blue|red|pink|casual|formal|summer|winter|men|women|black|grey|white|partywear)\b/g);
    
//     if (keywords) {
//       const results = clothingData.filter(item => {
//         return keywords.every(keyword => JSON.stringify(item).toLowerCase().includes(keyword));
//       });

//       if (results.length > 0) {
//         return res.json({
//           text: `Here are some products I found matching "${keywords.join(', ')}":`,
//           items: results.slice(0, 4) // send array of clothing objects
//         });
//       } else {
//         return res.json({ text: "❌ No matching products found. Try different keywords." });
//       }
//     }

//     res.json({ text: "👗 Ask me about clothes, like 'casual red dress' or 'partywear saree'." });
//   } catch (err) {
//     console.error('❌ Chatbot Error:', err);
//     res.status(500).json({ error: 'Chatbot failed' });
//   }
// });



// Fetch clothes
app.get('/clothes', async (req, res) => {
  try {
    const clothes = await Clothes.find().sort({ createdAt: -1 });
    res.json(clothes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clothes' });
  }
});

// Root
app.get('/', (req, res) => {
  res.send('👕 Merged ClothesUploader & Chatbot API is running');
});

// Error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[INFO] 🚀 Server running on port ${PORT}`);
});
