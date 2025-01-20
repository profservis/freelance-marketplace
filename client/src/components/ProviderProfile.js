//C:\Users\Владелец\freelance-marketplace\client\src\components\ProviderProfile.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile, getUserProfileById } from '../services/api';////удален 5 , getServices, acceptService

const ProviderProfile = () => {
   //const [user, setUser] = useState(null);
	//const [ services, setServices] = useState([]); ////удален 4*
	const { id } = useParams(); // Получаем ID из URL
	const navigate = useNavigate(); // Для перенаправления
	const [provider, setProvider] = useState(null);

	useEffect(() => {
		const fetchProviderProfile = async () => {
		try {
			let response;
			if (!id) {
				// Если ID отсутствует, загружаем профиль текущего пользователя
				response = await getUserProfile();
				// Перенаправляем на маршрут с ID текущего пользователя
				navigate(`/provider-profile/${response.data._id}`, { replace: true });
			} else {
				// Если ID указан, загружаем профиль по ID
				response = await getUserProfileById(id);
			}
			setProvider(response.data);
		} catch (error) {
			console.error('Ошибка загрузки профиля исполнителя:', error.response?.data || error.message);
		}
		};
		fetchProviderProfile();
	}, [id, navigate]);
	
	if (!provider) {
		return <p>Загрузка...</p>;
	}
	
  /* const handleAccept = async (serviceId) => {
    try {
      const response = await acceptService({ serviceId });
      console.log('Услуга принята:', response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  }; //удален 2*/

  /* const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('accountType');
    window.location.href = '/login';
  }; */

   return (
		<div>
			<h2>Профиль Исполнителя</h2>
			<p>Имя: {provider.name}</p>
			<p>Email: {provider.email}</p>
			<p>Тип аккаунта: {provider.accountType}</p>
		</div>
   );
};

export default ProviderProfile;