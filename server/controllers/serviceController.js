//C:\Users\Владелец\freelance-marketplace\server\controllers\serviceController.js
// Контроллеры для работы с услугами

const Service = require('../models/Service');
const Order = require('../models/Order'); // Не забудьте импортировать модель Order

const createService = async (req, res) => {
	// Проверка типа аккаунта
	if (req.user.accountType !== 'customer') {
		 return res.status(403).json({ message: 'Only customers can create services.' });
	}

	const { title, description, price, duration } = req.body;

	const service = new Service({
		customer: req.user._id,  // Устанавливаем ID текущего пользователя как заказчика
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

// Получение всех услуг (только открытые)
const getServices = async (req, res) => { //4
	// Используем populate для получения информации о заказчике
	const services = await Service.find({ status: 'Создано' }).populate('customer', 'name _id');
	res.json(services);
};
 

// Принятие услуги исполнителем
const acceptService = async (req, res) => {
  const { serviceId } = req.body;
  console.log(`Service ID: ${serviceId}`);
  // Найти услугу и проверить, что она еще открыта
  const service = await Service.findById(serviceId);
  if (!service || service.status !== 'Создано') {
    return res.status(404).json({ message: 'Service not found or already in progress' });
  }

  // Услугу может принять только исполнитель
  if (req.user.accountType !== 'provider') {
    return res.status(403).json({ message: 'Only providers can accept services' });
  }

  service.provider = req.user._id;
  service.status = 'in progress';
  await service.save();

  console.log(`Creating order for service: ${serviceId}`); // Логирование перед созданием заказа
  // Создаем заказ на основе принятой услуги
  const order = new Order({
	  service: service._id,
	  customer: service.customer,
	  provider: req.user._id,
	  status: 'pending',
  });
	//await order.save(); // Сохраняем заказ в базе данных
  const createdOrder = await order.save();  // Сохраняем заказ в базе данных
	// Логирование созданного заказа
  console.log('Order created:', createdOrder);
  res.json(service);
};

module.exports = {
  createService,
  getServices,
  acceptService,
  getCreatedServices,
};