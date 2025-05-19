// C:\Users\Владелец\freelance-marketplace\server\controllers\orderController.js

const Order = require('../models/Order');
const Service = require('../models/Service');

// Создание нового заказа
const createOrder = async (req, res) => {
  if (req.user.accountType !== 'customer') {
    return res.status(403).json({ message: 'Only customers can create orders.' });
  }

  const { serviceId, note } = req.body;
  const service = await Service.findById(serviceId);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  if (service.customer.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot order your own service' });
  }

  const order = new Order({
    service: service._id,
    customer: req.user._id,
    provider: service.provider,
    status: 'pending',
    note,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

// Получение заказов для заказчика с сортировкой по дате создания (новые первыми)
const getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 }) // сортировка по убыванию даты создания
      .populate('service')
      .populate('provider', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Получение заказов для исполнителя с сортировкой по дате создания (новые первыми)
const getProviderOrders = async (req, res) => {
  if (req.user.accountType !== 'provider') {
    return res.status(403).json({ message: 'Only providers can view these orders.' });
  }
  try {
    const orders = await Order.find({ provider: req.user._id })
      .sort({ createdAt: -1 }) // сортировка по убыванию даты создания
      .populate('service')
      .populate('customer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Обновление статуса заказа
const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      order.provider.toString() !== req.user._id.toString() &&
      order.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Принятие заказа заказчиком
const approveOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.customer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only approve your own orders.' });
  }

  order.status = 'participant';
  const updatedOrder = await order.save();

  res.json(updatedOrder);
};

// Отклонение заказа заказчиком
const rejectOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only reject your own orders.' });
    }

    order.status = 'rejected';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getProviderOrders,
  updateOrderStatus,
  approveOrder,
  rejectOrder,
};
