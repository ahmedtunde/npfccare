import apiClient from '../utils/apiClient';

export const resetCustomerPassword = async (phone) => {
  try {
    const response = await apiClient.post('/auth/reset_password', {phone});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};