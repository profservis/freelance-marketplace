//C:\Users\Владелец\freelance-marketplace\server\routes\serviceRoutes.js
//Создадим маршруты для добавления новых услуг и получения списка всех услуг.

const express = require('express');
const { createService, getServices, getCreatedServices, acceptService } = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createService).get(getServices);
router.route('/accept').post(protect, acceptService); // Новый маршрут для принятия услуги
router.route('/created').get(protect, getCreatedServices); // Новый маршрут для получения созданных услуг

module.exports = router;