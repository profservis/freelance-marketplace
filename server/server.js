// C:\Users\Владелец\freelance-marketplace\server\server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // добавлено
const { rotateKeys } = require('./config/jwtKeys');
const dotenv = require('dotenv');

// security
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Безопасные заголовки
app.use(helmet());

// Ограничение размера тела запроса (важно для защиты от больших payload-атак)
app.use(express.json({ limit: '10kb' })); // <- подберите лимит под реальную нагрузку

// Подключаем cookie-parser для чтения куков
app.use(cookieParser());

// Настройка CORS: явно указываем домен клиента (без "*")
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting (простая защита от брут/спама)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 120, // максимум 120 запросов с одного IP в минуту (подкорректируйте)
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Подключаем базу данных
connectDB();

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
// новый маршрут для категорий
app.use('/api/categories', require('./routes/categoryRoutes'));

app.get('/', (req, res) => {
  res.send('Добро пожаловать на фриланс-биржу!');
});

// Центральный обработчик ошибок (не отдаёт stack в продакшне)
app.use((err, req, res, next) => {
  console.error(err && err.message ? err.message : err);
  const msg = process.env.NODE_ENV === 'production' ? 'Server error' : (err.message || 'Server error');
  res.status(err.status || 500).json({ message: msg });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ротация JWT-ключей каждые 24 часа (если есть функция)
if (typeof rotateKeys === 'function') {
  setInterval(rotateKeys, 24 * 60 * 60 * 1000);
}

