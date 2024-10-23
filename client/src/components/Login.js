//C:\Users\Владелец\freelance-marketplace\client\src\components\Login.js
//Компонент для авторизации пользователя:
import React, { useState } from 'react';
import { loginUser } from '../services/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        accountType: 'customer',  // Роль по умолчанию
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await loginUser(formData);
			localStorage.setItem('jwtToken', response.data.token);
			localStorage.setItem('accountType', response.data.accountType);
			// Перенаправление в зависимости от роли пользователя
			if (response.data.accountType === 'customer') {
				window.location.href = '/customer-profile'; // Перенаправление заказчика
			} else if (response.data.accountType === 'provider') {
				window.location.href = '/provider-profile'; // Перенаправление исполнителя
			}
			} catch (error) {
				console.error(error.response.data.message);
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