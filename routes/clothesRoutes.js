// routes/clothesRoutes.js
const express = require('express');
const router = express.Router();
const Clothes = require('../models/Clothes');

// ✅ GET /clothes
router.get('/', async (req, res) => {
  try {
    const clothes = await Clothes.find().sort({ createdAt: -1 });
    res.json(clothes);
  } catch (err) {
    console.error('❌ Error fetching clothes:', err);
    res.status(500).json({ error: 'Failed to fetch clothes' });
  }
});

// ✅ DELETE /clothes/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Clothes.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting clothing item:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
