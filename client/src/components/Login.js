// C:\Users\Владелец\freelance-marketplace\client\src\components\Login.js
import React, { useState } from 'react';
import { loginUser } from '../services/api';
import Cookies from 'js-cookie'; // Для сохранения не секретных данных, например accountType

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    accountType: 'customer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      // Сервер устанавливает куку jwtToken, поэтому здесь сохраняем только accountType для UI, если нужно
      Cookies.set('accountType', response.data.accountType, { expires: 30, secure: true, sameSite: 'lax' });
      if (response.data.accountType === 'customer') {
        window.location.href = '/customer-profile';
      } else if (response.data.accountType === 'provider') {
        window.location.href = '/provider-profile';
      }
    } catch (error) {
      console.error(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Авторизация</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Пароль" onChange={handleChange} />
      <select name="accountType" onChange={handleChange}>
        <option value="customer">Заказчик</option>
        <option value="provider">Исполнитель</option>
      </select>
      <button type="submit">Войти</button>
    </form>
  );
};

export default Login;
