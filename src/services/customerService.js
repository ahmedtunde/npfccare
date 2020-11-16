import apiClient from '../utils/apiClient';

export const getCustomers = async () => {
  try {
    const response = await apiClient.get('/view_users');
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const verifyCustomerLiveliness = async (bvn) => {
  try {
    const response = await apiClient.post('/verify_user_liveliness', {bvn});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetCustomerPassword = async (bvn) => {
  try {
    const response = await apiClient.post('/reset_password', {bvn});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};