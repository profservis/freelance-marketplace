// C:\Users\Владелец\freelance-marketplace\client\src\App.js
import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import CreateService from './components/CreateService';
import Orders from './components/Orders';
import Services from './components/Services';
import CustomerProfile from './components/CustomerProfile';
import ProviderProfile from './components/ProviderProfile';
import Navigation from './Navigation';
import { getCreatedServices } from './services/api';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { user } = useAuth();
  const [createdServices, setCreatedServices] = useState([]);

  useEffect(() => {
    const fetchCreatedServices = async () => {
      try {
        const response = await getCreatedServices();
        setCreatedServices(response.data);
      } catch (error) {
        console.error('Ошибка получения созданных услуг:', error);
      }
    };

    if (user && user.accountType === 'customer') {
      fetchCreatedServices();
    }
  }, [user]);

  const handleServiceCreated = (service) => {
    setCreatedServices([...createdServices, service]);
  };

  return (
    <Router>
      <Navigation user={user} />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-service" element={<CreateService onServiceCreated={handleServiceCreated} />} />
        <Route path="/orders" element={<Orders accountType={user?.accountType} createdServices={createdServices} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />
        <Route path="/" element={<h1>Добро пожаловать на фриланс-биржу!</h1>} />
        <Route path="/customer-profile/:id" element={<CustomerProfile />} />
        <Route path="/provider-profile/:id" element={<ProviderProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
 