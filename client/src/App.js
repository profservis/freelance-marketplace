//C:\Users\Владелец\freelance-marketplace\client\src\App.js
//Шаг 4: Настройка роутинга. Теперь настроим роутинг для приложения, чтобы пользователи могли переключаться между различными страницами.
import './App.css';
import React, { useState, useEffect } from 'react'; // Добавлен импорт useState
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateService from './components/CreateService';
import Orders from './components/Orders';
import Services from './components/Services';
import CustomerProfile from './components/CustomerProfile';
import ProviderProfile from './components/ProviderProfile';
import { getCreatedServices } from './services/api'; // Импорт функции для получения созданных услуг

const App = () => {
  const accountType = localStorage.getItem('accountType');
  const [createdServices, setCreatedServices] = useState([]);

  useEffect(() => {
	const fetchCreatedServices = async () => {
	  try {
		 const response = await getCreatedServices();
		 setCreatedServices(response.data);
	  } catch (error) {
		 console.error('Error fetching created services:', error);
	  }
	};

	if (accountType === 'customer') {
	  fetchCreatedServices();
	}
 }, [accountType]);

	
  const handleServiceCreated = (service) => {
    setCreatedServices([...createdServices, service]);
  };

  return (
    <Router>
      <Navigation accountType={accountType} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-service" element={<CreateService onServiceCreated={handleServiceCreated} />} />
        <Route path="/orders" element={<Orders accountType={accountType} createdServices={createdServices} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />
		  <Route path="/" element={<h1>Добро пожаловать на фриланс-биржу!</h1>} />
		  <Route path="/customer-profile/:id" element={<CustomerProfile />} /> {/* 5 */}

      </Routes>
    </Router>
  );
};

const Navigation = ({ accountType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('accountType');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Главная</Link></li>
        {!accountType && <li><Link to="/register">Регистрация</Link></li>}
        {!accountType && <li><Link to="/login">Авторизация</Link></li>}
        {accountType === 'customer' && <li><Link to="/customer-profile">Профиль Заказчика</Link></li>}
        {accountType === 'provider' && <li><Link to="/provider-profile">Профиль Исполнителя</Link></li>}
        {accountType === 'customer' && <li><Link to="/create-service">Создать услугу</Link></li>}
        {accountType === 'provider' && <li><Link to="/services">Доступные услуги</Link></li>}
        {accountType && <li><Link to="/orders">Мои заказы</Link></li>}
        {accountType && <li><button onClick={handleLogout} style={{background: 'none', border: 'none', padding: 0, color: 'blue', cursor: 'pointer'}}>Выйти</button></li>}
      </ul>
    </nav>
  );
};

export default App;