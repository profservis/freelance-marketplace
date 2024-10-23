//C:\Users\Владелец\freelance-marketplace\server\routes\orderRoutes.js

const express = require('express');
const {
    createOrder,
    getCustomerOrders,
    getProviderOrders,
    updateOrderStatus,
    approveOrder,
    rejectOrder,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createOrder); // Оформление нового заказа
router.route('/customer').get(protect, getCustomerOrders); // Заказы заказчика
router.route('/provider').get(protect, getProviderOrders); // Заказы исполнителя
router.route('/status').put(protect, updateOrderStatus); // Обновление статуса заказа
router.route('/approve').put(protect, approveOrder); // Принятие исполнителя заказчиком
router.route('/reject').put(protect, rejectOrder); // Отклонение исполнителя заказчиком

module.exports = router;