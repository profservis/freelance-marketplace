//C:\Users\Владелец\freelance-marketplace\server\models\Service.js
//Создадим модель Service, контроллеры и маршруты для работы с услугами

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
	customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	title: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	duration: { type: Number, required: true },
	// Новые поля категорий
	category1: { type: String, required: true },
	category2: { type: String, required: true },
	category3: { type: String, required: true },
	status: {
		type: String,
		enum: ['Создано', 'Опубликовано', 'in progress', 'completed', 'cancelled', 'Отказано'],
		default: 'Создано'
	},
}, {
	timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);