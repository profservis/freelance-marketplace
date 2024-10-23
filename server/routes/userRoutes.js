//C:\Users\Владелец\freelance-marketplace\server\routes\userRoutes.js
//Теперь добавим новый маршрут для получения профиля пользователя в файле userRoutes.js.
const express = require('express');
const { getUserProfile, getUserProfileById } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile);
router.route('/profile/:id').get(protect, getUserProfileById);  //13 Новый маршрут для профиля по ID

module.exports = router;