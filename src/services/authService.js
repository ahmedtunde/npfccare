import apiClient from '../utils/apiClient';
import { setToken } from '../utils/localStorageService';

export const signInAdmin = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/admin_sign_in', {email, password});
    const token = response.data.token;
    setToken(token);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};