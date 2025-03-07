// C:\Users\Владелец\freelance-marketplace\client\src\hooks\useAuth.js
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return { user };
};
