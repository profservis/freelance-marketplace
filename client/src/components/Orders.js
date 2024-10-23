// C:\Users\Владелец\freelance-marketplace\client\src\components\Orders.js
import React, { useState, useEffect } from 'react';
import { getCustomerOrders, getProviderOrders, approveOrder, rejectOrder } from '../services/api';
import { Link } from 'react-router-dom';  // Импортируем Link для создания ссылок

const Orders = ({ accountType, createdServices }) => {
	const [orders, setOrders] = useState([]);
	//const [createdServices, setCreatedServices] = useState([]);//6 Мы добавим локальное состояние для услуг в статусе "Создано" и будем отображать их наряду с заказами, полученными с сервера:

	useEffect(() => {
		const fetchOrders = async () => {
		  const response = accountType === 'customer' ? await getCustomerOrders() : await getProviderOrders();
		  setOrders(response.data);
		};
		fetchOrders();
	}, [accountType]);

	const handleApproveOrder = async (orderId) => {
		try {
			const response = await approveOrder(orderId); // Передаем строку orderId
			console.log('Order approved:', response.data); // Логируем результат
			const updatedOrders = await getCustomerOrders();
			setOrders(updatedOrders.data);
		} catch (error) {
			console.error(error.response?.data?.message || error.message);
		}
	};

	const handleRejectOrder = async (orderId) => {
		try {
			const response = await rejectOrder(orderId); // Передаем строку orderId
			console.log('Order rejected:', response.data); // Логируем результат
			const updatedOrders = await getCustomerOrders();
			setOrders(updatedOrders.data);
		} catch (error) {
			console.error(error.response?.data?.message || error.message);
		}
	};

	return (
		<div>
			<h2>Мои заказы</h2>
			
			{createdServices.length ? ( 
			createdServices.map((service, index) => (
				<div key={index}>
					<p>Услуга: {service.title}</p>
					<p>Статус: Создано</p>
				</div>
				))
			) : null}
			
			{orders.length ? (
					orders.map((order) => (
						<div key={order._id}>
							<p>Услуга: {order.service.title}</p>

							{/* Если у заказа есть исполнитель, делаем его логин ссылкой на профиль */}
							{accountType !== 'provider' && order.provider && ( /* Чтобы скрыть поле "Исполнитель:" на странице исполнителя, можно использовать аналогичный подход с проверкой типа аккаунта. */
								<p>
									Исполнитель: <Link to="/provider-profile">{order.provider.name}</Link> {/* Ссылка на профиль исполнителя */}
								</p>
							)}

							
							{accountType !== 'customer' && ( /* Этот код проверяет, что если тип аккаунта не является "customer" (заказчик), то отображается информация о заказчике. В противном случае, это поле не отображается. */
								<p>Заказчик: <Link to={`/customer-profile/${order.customer._id}`}>{order.customer.name}</Link></p>
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