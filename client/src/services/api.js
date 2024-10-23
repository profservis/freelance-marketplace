//C:\Users\Владелец\freelance-marketplace\client\src\services\api.js
//Создайте папку services для управления запросами к серверу:

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api',
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
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
export const rejectOrder = (orderId) => API.put('/orders/reject', { orderId });//Убедитесь, что в файле api.js есть методы для взаимодействия с сервером.
export const getCreatedServices = () => API.get('/services/created'); // Новый метод.
export const getUserProfileById = (id) => API.get(`/users/profile/${id}`); //10
