//C:\Users\Владелец\freelance-marketplace\client\src\components\CustomerProfile.js
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api'; //удалил из скобок это: createService
import { useParams, useNavigate } from 'react-router-dom';  //6 Импортируем useParams
import { getUserProfileById } from '../services/api';  //7 Создадим новый метод для запроса профиля по ID

const CustomerProfile = () => {
	const { id } = useParams();  //8 Получаем id из URL
	console.log('Полученный id:', id);  // Логируем id для проверки
	const navigate = useNavigate(); // Для перенаправления
   const [user, setUser] = useState(null);
  /* const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
  }); */

	useEffect(() => {
		const fetchProfile = async () => {
		try {
			let response;
			if (id) {
				console.log('Запрашиваем профиль по ID:', id);
				response = await getUserProfileById(id);
			} else {
				console.log('Запрашиваем профиль текущего пользователя');
				response = await getUserProfile();
				// Перенаправляем на маршрут с ID, если ID отсутствует
				navigate(`/customer-profile/${response.data._id}`);
				return; // Прекращаем выполнение, чтобы избежать повторного вызова setUser
			}
			setUser(response.data);
		} catch (error) {
			console.error('Ошибка загрузки профиля:', error.response?.data || error.message);
		}
		};
		fetchProfile();
	}, [id, navigate]);

	if (!user) {
		return <p>Загрузка...</p>;
	}
	
  /* const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createService(formData);
      console.log('Услуга создана:', response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  }; */

  /* const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('accountType');
    window.location.href = '/login';
  }; */

  return (
    <div>
      <h2>Личный кабинет заказчика</h2>
      {user ? (
        <div>
          <h3>Профиль</h3>
          <p>Имя: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Тип аккаунта: {user.accountType}</p>
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
      {/* {<form onSubmit={handleSubmit}>
        <h3>Публикация услуги</h3>
        <input type="text" name="title" placeholder="Заголовок" onChange={handleChange} />
        <textarea name="description" placeholder="Описание" onChange={handleChange}></textarea>
        <input type="number" name="price" placeholder="Цена" onChange={handleChange} />
        <input type="number" name="duration" placeholder="Срок выполнения (в днях)" onChange={handleChange} />
        <button type="submit">Создать услугу</button>
      </form>} */}
      {/* {<button onClick={handleLogout}>Выйти</button>} */}
    </div>
  );
};

export default CustomerProfile;