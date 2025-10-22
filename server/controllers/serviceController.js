//C:\Users\Владелец\freelance-marketplace\server\controllers\serviceController.js

// Контроллеры для работы с услугами — обновлённая версия:
// - sanitize-html для title/description
// - проверка ObjectId
// - whitelist категорий (взял из client side nestedCategories)
// - атомарное принятие: транзакция при возможности, fallback => findOneAndUpdate
// Улучшенный контроллер для услуг: sanitize, ObjectId.isValid, whitelist категорий,
// атомарный accept (транзакция если доступна) + fallback, аккуратное логирование.

const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');

const Service = require('../models/Service');
const Order = require('../models/Order');
const nestedCategories = require('../config/nestedCategories'); // единый источник правды для категорий

// Рекомендуется вынести строки статусов в отдельный модуль (constants/statuses.js).
const STATUS = {
  CREATED: 'Создано',
  IN_PROGRESS: 'in progress', // оставлено для совместимости с вашей логикой
  REJECTED: 'Отказано'
};

// Валидация входящих данных (серверная)
function validateServicePayload({ title, description, price, duration, category1, category2, category3 }) {
  if (!title || typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 55) {
    return { ok: false, message: 'Название обязательно и не должно превышать 55 символов.' };
  }
  if (!description || typeof description !== 'string' || description.trim().length < 100 || description.trim().length > 1500) {
    return { ok: false, message: 'Описание обязательно — минимум 100 символов, максимум 1500.' };
  }
  if (price === undefined || price === null || isNaN(Number(price))) {
    return { ok: false, message: 'Цена должна быть числом.' };
  }
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 500 || priceNum > 200000) {
    return { ok: false, message: 'Допустимая цена от 500 до 200000.' };
  }
  if (duration === undefined || duration === null || isNaN(Number(duration)) || Number(duration) <= 0) {
    return { ok: false, message: 'Срок выполнения должен быть положительным числом (в днях).' };
  }
  if (!category1 || !category2 || !category3) {
    return { ok: false, message: 'Необходимо указать все уровни категорий.' };
  }

  // whitelist категорий - используем серверный источник nestedCategories
  if (!nestedCategories[category1]) return { ok: false, message: 'Недопустимая категория (category1).' };
  if (!nestedCategories[category1][category2]) return { ok: false, message: 'Недопустимая подрубрика (category2).' };
  if (!nestedCategories[category1][category2].includes(category3)) return { ok: false, message: 'Недопустимое уточнение (category3).' };

  return { ok: true };
}

const createService = async (req, res) => {
  try {
    if (!req.user || req.user.accountType !== 'customer') {
      return res.status(403).json({ message: 'Only customers can create services.' });
    }

    const { title, description, price, duration, category1, category2, category3 } = req.body;

    const validation = validateServicePayload({ title, description, price, duration, category1, category2, category3 });
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message });
    }

    // Санитизация — удаляем HTML/скрипты. Если хотите разрешать некоторые теги, настройте allowedTags.
    const cleanTitle = sanitizeHtml(String(title), { allowedTags: [], allowedAttributes: {} }).trim();
    const cleanDescription = sanitizeHtml(String(description), { allowedTags: [], allowedAttributes: {} }).trim();

    const service = new Service({
      customer: req.user._id,
      title: cleanTitle,
      description: cleanDescription,
      price: Number(price),
      duration: Number(duration),
      category1: String(category1).trim(),
      category2: String(category2).trim(),
      category3: String(category3).trim(),
      status: STATUS.CREATED
    });

    const createdService = await service.save();
    return res.status(201).json(createdService);
  } catch (error) {
    // В продакшне не отдаём стеки клиенту
    console.error('createService error:', error && error.message ? error.message : error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCreatedServices = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Не авторизован' });
    const services = await Service.find({ status: STATUS.CREATED, customer: req.user._id }).sort({ createdAt: -1 });
    return res.json(services);
  } catch (error) {
    console.error('getCreatedServices error:', error && error.message ? error.message : error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: STATUS.CREATED }).populate('customer', 'name _id');
    return res.json(services);
  } catch (error) {
    console.error('getServices error:', error && error.message ? error.message : error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const acceptService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ message: 'serviceId is required' });

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid serviceId' });
    }

    if (!req.user || req.user.accountType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can accept services' });
    }

    // Попытка использовать транзакцию, если Mongo настроен на replica set
    let session;
    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const updated = await Service.findOneAndUpdate(
        { _id: serviceId, status: STATUS.CREATED },
        { $set: { provider: req.user._id, status: STATUS.IN_PROGRESS } },
        { new: true, session }
      );

      if (!updated) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Service not found or not available' });
      }

      // Создаём заказ в той же транзакции
      const order = new Order({
        service: updated._id,
        customer: updated.customer,
        provider: req.user._id,
        status: 'pending'
      });
      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      return res.json(updated);
    } catch (txErr) {
      // транзакции недоступны или случилась ошибка — fallback на атомарный findOneAndUpdate без session
      if (session) {
        try { await session.abortTransaction(); session.endSession(); } catch (e) { /* ignore */ }
      }
      console.warn('Transaction failed or not available, fallback to non-transactional flow:', txErr && txErr.message ? txErr.message : txErr);

      // fallback: atomic findOneAndUpdate
      const updatedFallback = await Service.findOneAndUpdate(
        { _id: serviceId, status: STATUS.CREATED },
        { $set: { provider: req.user._id, status: STATUS.IN_PROGRESS } },
        { new: true }
      );
      if (!updatedFallback) {
        return res.status(404).json({ message: 'Service not found or not available' });
      }
      const order = new Order({
        service: updatedFallback._id,
        customer: updatedFallback.customer,
        provider: req.user._id,
        status: 'pending'
      });
      await order.save();
      return res.json(updatedFallback);
    }
  } catch (error) {
    console.error('acceptService error:', error && error.message ? error.message : error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const rejectService = async (req, res) => {
  try {
    const { serviceId } = req.body;
    if (!serviceId) return res.status(400).json({ message: 'serviceId is required' });

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res.status(400).json({ message: 'Invalid serviceId' });
    }

    if (!req.user || req.user.accountType !== 'provider') {
      return res.status(403).json({ message: 'Only providers can reject services' });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.status !== STATUS.CREATED) {
      return res.status(400).json({ message: 'Cannot reject a service that is not in "Создано" status' });
    }

    service.status = STATUS.REJECTED;
    service.provider = undefined;
    await service.save();

    return res.json({ message: 'Service rejected' });
  } catch (error) {
    console.error('rejectService error:', error && error.message ? error.message : error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createService,
  getServices,
  getCreatedServices,
  acceptService,
  rejectService,
};
