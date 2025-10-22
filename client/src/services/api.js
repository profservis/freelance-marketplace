// C:\Users\Владелец\freelance-marketplace\client\src\services\api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // отправка куков с каждым запросом
});

API.interceptors.request.use((req) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
    req.headers['Content-Type'] = 'application/json';
  }
  console.log('Запрос:', req.method, req.url, req.headers);
  return req;
});

export const registerUser = (userData) => API.post('/auth/register', userData);
export const loginUser = (userData) => API.post('/auth/login', userData);
export const createService = (serviceData) => API.post('/services', serviceData);
export const getServices = () => API.get('/services');
export const acceptService = (serviceData) => API.post('/services/accept', serviceData);
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getCustomerOrders = () => API.get('/orders/customer');
export const getProviderOrders = () => API.get('/orders/provider');
export const updateOrderStatus = (orderData) => API.put('/orders/status', orderData);
export const getUserProfile = () => API.get('/users/profile');
export const approveOrder = (orderId) => API.put('/orders/approve', { orderId });
export const rejectOrder = (orderId) => API.put('/orders/reject', { orderId });
export const getCreatedServices = () => API.get('/services/created');
export const getUserProfileById = (id) => API.get(`/users/profile/${id}`);
export const logoutUser = () => API.post('/auth/logout');
export const rejectService = serviceData => API.post('/services/reject', serviceData);  // новый экспорт
// NEW: получить список категорий с сервера
export const getCategories = () => API.get('/categories');