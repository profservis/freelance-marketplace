//C:\Users\Владелец\freelance-marketplace\server\controllers\authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { jwtKeys } = require('../config/jwtKeys');//Импорт ключей из нового модуля.


dotenv.config();

// Генерация JWT
/* const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}; */
// Генерация JWT
const generateToken = (id) => {
	return jwt.sign({ id }, jwtKeys.current, { expiresIn: '30d' });
 };
 
 // Пример регистрации пользователя
 const registerUser = async (req, res) => {
	const { name, email, password, accountType } = req.body;
 
	try {
	  const userExists = await User.findOne({ email });
 
	  if (userExists) {
		 return res.status(400).json({ message: 'Пользователь уже существует' });
	  }
 
	  if (!['customer', 'provider'].includes(accountType)) {
		 return res.status(400).json({ message: 'Неверный тип аккаунта' });
	  }
 
	  const user = await User.create({ name, email, password, accountType });
 
	  res.status(201).json({
		 _id: user._id,
		 name: user.name,
		 email: user.email,
		 accountType: user.accountType,
		 token: generateToken(user._id),
	  });
	} catch (error) {
	  console.error('Ошибка регистрации:', error.message);
	  res.status(500).json({ message: 'Ошибка сервера' });
	}
};

// Авторизация пользователя (заказчик или исполнитель)
const authUser = async (req, res) => {
	const { email, password, accountType } = req.body;

	try {
		 const user = await User.findOne({ email });

		 if (user && (await user.matchPassword(password))) {
			  if (user.accountType !== accountType) {
					return res.status(401).json({ message: 'Invalid account type' });
			  }
			  res.json({
					_id: user._id,
					name: user.name,
					email: user.email,
					accountType: user.accountType,
					token: generateToken(user._id),
			  });
		 } else {
			  res.status(401).json({ message: 'Invalid email or password' });
		 }
	} catch (error) {
		 res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
  registerUser,
  authUser,
};