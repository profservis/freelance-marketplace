//C:\Users\Владелец\freelance-marketplace\client\src\components\Services.js
//логика для отображения доступных услуг

import React, { useState, useEffect } from 'react';
import { getServices, acceptService } from '../services/api';
import { Link } from 'react-router-dom'; // 1

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getServices();
      setServices(response.data);
    };
    fetchServices();
  }, []);

  const handleAccept = async (serviceId) => {
    try {
      const response = await acceptService({ serviceId });
      console.log('Услуга принята:', response.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Доступные услуги</h2>
      {services.length === 0 ? (
        <p>Нет доступных услуг</p>
      ) : (
        services.map((service) => (
          <div key={service._id}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>Цена: {service.price} $</p>
				<p>Срок: {service.duration} дней</p>
				<p>Заказчик: <Link to={`/customer-profile/${service.customer._id}`}>{service.customer.name}</Link></p> {/* 2 */}
            <button onClick={() => handleAccept(service._id)}>Принять услугу</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Services;