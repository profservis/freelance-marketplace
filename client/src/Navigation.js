// C:\Users\Владелец\freelance-marketplace\client\src\Navigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from './services/api';
import Cookies from 'js-cookie';

const Navigation = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      Cookies.remove('accountType');
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', error.response?.data?.message || error.message);
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Главная</Link></li>
        {!user && <li><Link to="/register">Регистрация</Link></li>}
        {!user && <li><Link to="/login">Авторизация</Link></li>}
        {user && user.accountType === 'customer' && <li><Link to={`/customer-profile/${user._id}`}>Профиль Заказчика</Link></li>}
        {user && user.accountType === 'provider' && <li><Link to={`/provider-profile/${user._id}`}>Профиль Исполнителя</Link></li>}
        {user && user.accountType === 'customer' && <li><Link to="/create-service">Создать услугу</Link></li>}
        {user && user.accountType === 'provider' && <li><Link to="/services">Доступные услуги</Link></li>}
        {user && <li><Link to="/orders">Мои заказы</Link></li>}
        {user && <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, color: 'blue', cursor: 'pointer' }}>Выйти</button></li>}
      </ul>
    </nav>
  );
};

export default Navigation;
