// C:\Users\Владелец\freelance-marketplace\client\src\components\Orders.js

import React, { useState, useEffect } from 'react';
import { getCustomerOrders, getProviderOrders, approveOrder, rejectOrder } from '../services/api';
import { Link } from 'react-router-dom';

const Orders = ({ accountType, createdServices }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!accountType) return;
      const response = accountType === 'customer' 
        ? await getCustomerOrders() 
        : accountType === 'provider' 
          ? await getProviderOrders() 
          : { data: [] };
      setOrders(response.data);
    };
    fetchOrders();
  }, [accountType]);

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await approveOrder(orderId);
      console.log('Order approved:', response.data);
      const updatedOrders = await getCustomerOrders();
      setOrders(updatedOrders.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const response = await rejectOrder(orderId);
      console.log('Order rejected:', response.data);
      const updatedOrders = await getCustomerOrders();
      setOrders(updatedOrders.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Мои заказы</h2>
      
      {createdServices.length > 0 && (
        createdServices.map((service, index) => (
          <div key={index}>
            <p>Услуга: {service.title}</p>
            <p>Статус: Создано</p>
          </div>
        ))
      )}
      
      {orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id}>
            <p>Услуга: {order.service.title}</p>

            {accountType === 'customer' && order.provider && (
              <p>
                Исполнитель: <Link to={`/provider-profile/${order.provider._id}`}>{order.provider.name}</Link>
              </p>
            )}

            {accountType === 'provider' && order.customer && (
              <p>
                Заказчик: <Link to={`/customer-profile/${order.customer._id}`}>{order.customer.name}</Link>
              </p>
            )}

            <p>Статус: {order.status}</p>
            
            {accountType === 'customer' && order.status === 'pending' && (
              <div>
                <button onClick={() => handleApproveOrder(order._id)}>Принять</button>
                <button onClick={() => handleRejectOrder(order._id)}>Отклонить</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Заказов нет</p>
      )}
    </div>
  );
};

export default Orders;
