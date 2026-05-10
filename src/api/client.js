import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://157.66.100.48:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = token.trim().toLowerCase().startsWith('bearer ')
      ? token.trim()
      : `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallback = 'Unable to reach the Pet Shop API. Showing curated local collection.';
    const message =
      error.response?.data?.message ??
      error.response?.data?.title ??
      (typeof error.response?.data === 'string' ? error.response.data : undefined) ??
      error.message ??
      fallback;
    const apiError = new Error(message);
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;
    return Promise.reject(apiError);
  }
);
