import apiClient from '../utils/apiClient';

export const getDocTypes = async () => {
  try {
    const response = await apiClient.get(`/signup/get_doc_types`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomers = async (channel = "") => {
  try {
    const response = await apiClient.get(`/support/view_customers?channel=${channel}`);
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

export const resetCustomerPassword = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/reset_password', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unlockCustomerAccount = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/unlock_account', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unlinkCustomerDevice = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/reset_device', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetCustomerTxnPIN = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/reset_pin', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const syncCustomerInfo = async (customer_id) => {
  try {
    const response = await apiClient.post('/support/update_customer_info', {customer_id});
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};