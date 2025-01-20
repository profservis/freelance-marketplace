//C:\Users\Владелец\freelance-marketplace\server\server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const { rotateKeys } = require('./config/jwtKeys');//Теперь ротация ключей управляется вручную. Добавим автоматическую ротацию:
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors()); //Если сервер и клиент работают на разных хостах или портах, убедитесь, что CORS правильно настроен на сервере. В server.js добавьте поддержку CORS:

// Middleware для обработки JSON
app.use(express.json());/* app.use(express.json({ type: 'application/json; charset=utf-8' })); */
// Подключение к базе данных
connectDB();
// Маршруты
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));


// Маршрут для корневого пути
app.get('/', (req, res) => {
  res.send('Добро пожаловать на фриланс-биржу!');
});

const PORT = process.env.PORT || 5001;//Измените 5000 на другой порт, например, 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ротация ключей каждые 24 часа
setInterval(rotateKeys, 24 * 60 * 60 * 1000);