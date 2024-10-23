//C:\Users\Владелец\freelance-marketplace\server\models\Order.js
//Для начала создадим модель заказа, которая будет включать ссылки на пользователя-заказчика, услугу, исполнителя и статус заказа.

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Service',
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in progress', 'completed', 'cancelled', 'rejected', 'participant'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    note: {
        type: String,
    },
});

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;