const express = require('express');
const Product = require('../models/Products');
const jwt = require('jsonwebtoken');
const router = express.Router();
function adminOnly(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return res.sendStatus(403);
    next();
  } catch {
    res.sendStatus(401);
  }
}
router.get('/', async (req, res) => {
  const { category, season } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (season) filter.season = season;
  const products = await Product.find(filter);
  res.json(products);
});

// Add product (admin only)
router.post('/', adminOnly, async (req, res) => {
  const { name, description, price, image, category, season } = req.body;
  if (!name || !description || !price || !image || !category || !season) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const product = new Product({ name, description, price, image, category, season });
  await product.save();
  res.json(product);
});

router.put('/:id', adminOnly, async (req, res) => {
  const { name, description, price, image, category, season } = req.body;
  const update = { name, description, price, image, category, season };
  const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(product);
});

router.delete('/:id', adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
