//C:\Users\Владелец\freelance-marketplace\server\controllers\authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Генерация JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Регистрация пользователя (заказчик или исполнитель)
const registerUser = async (req, res) => {
	console.log('Request Body:', req.body); // Добавьте здесь
	const { name, email, password, accountType } = req.body;
	
	// Логируем полученный accountType и всё тело запроса
	console.log('Received accountType:', accountType); // Добавьте здесь

	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: 'User already exists' });
		}
		console.log('Received accountType:', accountType);
		if (!['customer', 'provider'].includes(accountType)) {
			console.log('Invalid accountType:', accountType); // Логируем неверное значение
			return res.status(400).json({ message: 'Invalid account type' });
		}

		const user = await User.create({
			name,
			email,
			password,
			accountType,
		});

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			accountType: user.accountType,
			token: generateToken(user._id),
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
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