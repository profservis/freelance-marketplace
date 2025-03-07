// C:\Users\Владелец\freelance-marketplace\server\middlewares\authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtKeys } = require('../config/jwtKeys');

const protect = async (req, res, next) => {
  // Извлекаем токен из куки
  let token = req.cookies.jwtToken;
  // Если куки отсутствуют, проверяем заголовок (для совместимости)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
  }

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, jwtKeys.current);
      console.log('Токен успешно декодирован:', decoded);
    } catch (err) {
      if (jwtKeys.backup) {
        decoded = jwt.verify(token, jwtKeys.backup);
        console.log('Токен проверен с резервным ключом:', decoded);
      } else {
        throw err;
      }
    }
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    console.error('Ошибка авторизации:', error.message);
    res.status(401).json({ message: 'Не авторизован, ошибка токена' });
  }
};

module.exports = { protect };
