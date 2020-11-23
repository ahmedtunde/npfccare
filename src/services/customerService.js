import apiClient from '../utils/apiClient';

export const getCustomers = async (channel = "") => {
  try {
    const response = await apiClient.get(`/admin/view_customers/?channel=${channel}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchCustomers = async (searchPhrase) => {
  try {
    const response = await apiClient.get(`/admin/search_customers?searchPhrase=${searchPhrase}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomer = async (customer_id) => {
  try {
    const response = await apiClient.get(`/admin/view_customer?customer_id=${customer_id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerBankAcc = async (customer_id) => {
  try {
    const response = await apiClient.get(`/admin/view_customer_bank_accounts?customer_id=${customer_id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/liveliness_check', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/liveliness_uncheck', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/documents_check', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/documents_uncheck', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/enable_customer', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const disableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/disable_customer', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enforcePND = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/enforce_pnd', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removePND = async (customer_id) => {
  try {
    const response = await apiClient.post('/admin/remove_pnd', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};