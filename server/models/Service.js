//C:\Users\Владелец\freelance-marketplace\server\models\Service.js
//Создадим модель Service, контроллеры и маршруты для работы с услугами

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // В днях
  customer: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  provider: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['Создано', 'in progress', 'completed', 'cancelled'],
    default: 'Создано',
  }
}, {
  timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
