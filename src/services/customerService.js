import apiClient from '../utils/apiClient';

export const getCustomers = async (channel = "") => {
  try {
    const response = await apiClient.get(`/support/view_customers/?channel=${channel}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchCustomers = async (searchPhrase) => {
  try {
    const response = await apiClient.get(`/support/search_customers?searchPhrase=${searchPhrase}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomer = async (customer_id) => {
  try {
    const response = await apiClient.get(`/support/view_customer?customer_id=${customer_id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerBankAcc = async (customer_id) => {
  try {
    const response = await apiClient.get(`/support/view_customer_bank_accounts?customer_id=${customer_id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};


export const getCustomerLogs = async (customer_id) => {
  try {
    const response = await apiClient.get(`/support/view_customer_logs?customer_id=${customer_id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/liveliness_check', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/liveliness_uncheck', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/documents_check', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/documents_uncheck', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/enable_customer', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const disableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/disable_customer', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enforcePND = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/enforce_pnd', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removePND = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/remove_pnd', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};