import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Добавить токен к каждому запросу
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { refreshToken, logout, setAuth } = useAuthStore.getState();

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, user } = response.data;
          setAuth(user, token, refreshToken);

          // Повторить исходный запрос
          return api.request(error.config);
        } catch (err) {
          logout();
        }
      } else {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
