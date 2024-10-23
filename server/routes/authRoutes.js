//C:\Users\Владелец\freelance-marketplace\server\routes\authRoutes.js
const express = require('express');
const { registerUser, authUser } = require('../controllers/authController');

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', registerUser);

// Авторизация пользователя
router.post('/login', authUser);

module.exports = router;