//C:\Users\Владелец\freelance-marketplace\client\src\components\Services.js
//логика для отображения доступных услуг


import React, { useState, useEffect } from 'react';
import { getServices, acceptService, rejectService } from '../services/api'; // добавили rejectService
import { Link } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        setServices(response.data);
      } catch (error) {
        console.error('Ошибка при получении услуг:', error.response?.data?.message || error.message);
      }
    };
    fetchServices();
  }, []);

  const handleAccept = async (serviceId) => {
    try {
      await acceptService({ serviceId });
      setServices(prev => prev.filter(s => s._id !== serviceId));
    } catch (error) {
      console.error('Ошибка при принятии услуги:', error.response?.data?.message || error.message);
    }
  };

  const handleReject = async (serviceId) => {
    try {
      await rejectService({ serviceId });      // HTTP-запрос на отказ
      setServices(prev => prev.filter(s => s._id !== serviceId));
    } catch (error) {
      console.error('Ошибка при отказе от услуги:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Доступные услуги</h2>
      {services.length === 0 ? (
        <p>Нет доступных услуг</p>
      ) : (
        services.map(service => (
          <div key={service._id} style={{ border: '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Цена: {service.price} $</p>
            <p>Срок: {service.duration} дней</p>
            <p>Заказчик: <Link to={`/customer-profile/${service.customer._id}`}>{service.customer.name}</Link></p>
            <button onClick={() => handleAccept(service._id)}>Принять услугу</button>
            <button onClick={() => handleReject(service._id)} style={{ marginLeft: '8px' }}>Отказаться</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Services;
