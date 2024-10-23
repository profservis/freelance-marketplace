//C:\Users\Владелец\freelance-marketplace\server\controllers\userController.js
//Добавим маршрут для получения информации о текущем пользователе
const User = require('../models/User');  // Добавьте этот импорт

const getUserProfile = async (req, res) => {
	const user = req.user;
 
	if (user) {
	  res.json(user);
	} else {
	  res.status(404).json({ message: 'User not found' });
	}
};
 

const getUserProfileById = async (req, res) => {//11
	try {
	  const user = await User.findById(req.params.id).select('name email accountType');  // Здесь используем req.params.id
	  if (!user) {
		 return res.status(404).json({ message: 'User not found' });
	  }
	  res.json(user);
	} catch (error) {
	  res.status(400).json({ message: 'Invalid user ID' });
	}
};
 
 
// Экспортируем обе функции вместе
module.exports = { //12
	getUserProfile,
	getUserProfileById
};
 