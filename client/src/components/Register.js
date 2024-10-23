//C:\Users\Владелец\freelance-marketplace\client\src\components\Register.js
//Создадим компоненты для регистрации, авторизации, профиля пользователя, публикации услуг, оформления заказов и просмотра заказов.
import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		accountType: 'customer',
	});

	const handleChange = (e) => {
		console.log(`${e.target.name}: ${e.target.value}`); // Логирование изменения полей формы
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Отправка данных:', formData);
		try {
			 const response = await registerUser(formData);
			 console.log('Ответ сервера:', response.data);
		} catch (error) {
			 console.error(
				  error.response && error.response.data
						? error.response.data.message
						: 'Ошибка регистрации.'
			 );
		}
   };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>
      <input type="text" name="name" placeholder="Имя" onChange={handleChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} />
      <input type="password" name="password" placeholder="Пароль" onChange={handleChange} />
      <select name="accountType" onChange={handleChange}>
        <option value="customer">Заказчик</option>
        <option value="provider">Исполнитель</option>
      </select>
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;