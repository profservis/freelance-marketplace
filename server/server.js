// C:\Users\Владелец\freelance-marketplace\server\server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // добавлено
const { rotateKeys } = require('./config/jwtKeys');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Используем express.json() для обработки JSON
app.use(express.json());

// Подключаем cookie-parser для чтения куков
app.use(cookieParser());

// Настройка CORS: явно указываем домен клиента (без "*")
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Подключаем базу данных
connectDB();

// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.send('Добро пожаловать на фриланс-биржу!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ротация JWT-ключей каждые 24 часа
setInterval(rotateKeys, 24 * 60 * 60 * 1000);
