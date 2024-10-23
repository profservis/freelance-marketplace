//C:\Users\Владелец\freelance-marketplace\client\src\components\ProviderProfile.js
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';////удален 5 , getServices, acceptService

const ProviderProfile = () => {
  const [user, setUser] = useState(null);
  //const [ services, setServices] = useState([]); ////удален 4*

	useEffect(() => {
		const fetchProfile = async () => {
			const response = await getUserProfile();
			setUser(response.data);
		};
		fetchProfile();

		/* const fetchServices = async () => {
			const response = await getServices();
			setServices(response.data);
		};
		fetchServices(); //удален 3*/
	}, []);

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
      <h2>Личный кабинет исполнителя</h2>
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
      {/* <h3>Доступные услуги</h3>
      {services.map((service) => (
        <div key={service._id}>
          <h4>{service.title}</h4>
          <p>{service.description}</p>
          <p>Цена: {service.price} $</p>
          <p>Срок: {service.duration} дней</p>
          <button onClick={() => handleAccept(service._id)}>Принять услугу</button>
        </div>
      ))} //удален 1*/}
      {/* <button onClick={handleLogout}>Выйти</button> */}
    </div>
  );
};

export default ProviderProfile;