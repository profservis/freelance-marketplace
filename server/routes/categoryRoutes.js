// C:\Users\Владелец\freelance-marketplace\server\routes\categoryRoutes.js
const express = require('express');
const router = express.Router();
const nestedCategories = require('../config/nestedCategories');

// GET /api/categories
router.get('/', (req, res) => {
  // Возвращаем полный объект категорий
  res.json(nestedCategories);
});

module.exports = router;
