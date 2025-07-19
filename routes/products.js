 // routes/products.js
const express = require('express');
const router = express.Router();
const Clothes = require('../models/Clothes');

// GET /api/products/search?q=...
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q?.trim() || '';
    if (!query) return res.status(400).json({ error: 'Query string is required' });

    const regex = new RegExp(query, 'i');
    const results = await Clothes.find({
      $or: [
        { productDisplayName: regex },
        { subType: regex },
        { type: regex },
        { style: regex },
        { color: regex },
        { season: regex },
        { gender: regex }
      ]
    })
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error('❌ Product Search Error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Clothes.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Product not found' });
    res.json(item);
  } catch (err) {
    console.error('❌ Fetch by ID Error:', err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

module.exports = router;
