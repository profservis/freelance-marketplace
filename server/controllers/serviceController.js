//C:\Users\Владелец\freelance-marketplace\server\controllers\serviceController.js
// Контроллеры для работы с услугами


// C:\Users\Владелец\freelance-marketplace\server\controllers\serviceController.js

const Service = require('../models/Service');
const Order = require('../models/Order');

const createService = async (req, res) => {
  if (req.user.accountType !== 'customer') {
    return res.status(403).json({ message: 'Only customers can create services.' });
  }
  const { title, description, price, duration } = req.body;
  const service = new Service({
    customer: req.user._id,
    title,
    description,
    price,
    duration,
    status: 'Создано',
  });
  try {
    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCreatedServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'Создано', customer: req.user._id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Вернёт только услуги со статусом 'Создано'
const getServices = async (req, res) => {
  try {
    const services = await Service
      .find({ status: 'Создано' })
      .populate('customer', 'name _id');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const acceptService = async (req, res) => {
  const { serviceId } = req.body;
  const service = await Service.findById(serviceId);
  if (!service || service.status !== 'Создано') {
    return res.status(404).json({ message: 'Service not found or already in progress' });
  }
  if (req.user.accountType !== 'provider') {
    return res.status(403).json({ message: 'Only providers can accept services' });
  }
  service.provider = req.user._id;
  service.status = 'in progress';
  await service.save();

  const order = new Order({
    service: service._id,
    customer: service.customer,
    provider: req.user._id,
    status: 'pending',
  });
  await order.save();

  res.json(service);
};

const rejectService = async (req, res) => {
  const { serviceId } = req.body;
  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }
  if (req.user.accountType !== 'provider') {
    return res.status(403).json({ message: 'Only providers can reject services' });
  }
  // Устанавливаем «Отказано» — в выдачу getServices больше не попадёт
  service.status = 'Отказано';
  service.provider = undefined;
  await service.save();
  res.json({ message: 'Service rejected' });
};

module.exports = {
  createService,
  getServices,
  getCreatedServices,
  acceptService,
  rejectService,
};
