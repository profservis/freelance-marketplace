// C:\Users\Владелец\freelance-marketplace\client\src\components\CustomerProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfileById, getUserProfile } from '../services/api';

const CustomerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = id 
          ? await getUserProfileById(id)
          : await getUserProfile();
        setProfile(response.data);
      } catch (error) {
        console.error('Ошибка получения профиля:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h2>Личный кабинет заказчика</h2>
      <div>
        <h3>Профиль</h3>
        <p>Имя: {profile.name}</p>
        <p>Email: {profile.email}</p>
        <p>Тип аккаунта: {profile.accountType}</p>
      </div>
    </div>
  );
};

export default CustomerProfile;
