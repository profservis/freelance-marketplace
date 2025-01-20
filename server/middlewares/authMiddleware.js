//C:\Users\Владелец\freelance-marketplace\server\middlewares\authMiddleware.js
//Создадим middleware, который будет проверять токен и извлекать данные пользователя из него.
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtKeys } = require('../config/jwtKeys');//импорт ключей


const protect = async (req, res, next) => {
	let token;
 
	if (
	  req.headers.authorization &&
	  req.headers.authorization.startsWith('Bearer')
	) {
	  try {
		 token = req.headers.authorization.split(' ')[1];
 
		 let decoded;
		 try {
			 decoded = jwt.verify(token, jwtKeys.current); // Проверяем текущим ключом
			 console.log('Токен успешно декодирован:', decoded); // Логируем декодированный токен
		 } catch (err) {
			if (jwtKeys.backup) {
				decoded = jwt.verify(token, jwtKeys.backup); // Проверяем резервным ключом
				console.log('Токен проверен с резервным ключом:', decoded); // Логируем результат с резервным ключом
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
	} else {
	  res.status(401).json({ message: 'Не авторизован, токен отсутствует' });
	}
};
 
 

 

module.exports = { protect };