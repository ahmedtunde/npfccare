const { REACT_APP_ACCESS_STORAGE_TOKEN } = process.env;

export const setToken = token => localStorage.setItem(REACT_APP_ACCESS_STORAGE_TOKEN, token);

export const getAccessToken = () => localStorage.getItem(REACT_APP_ACCESS_STORAGE_TOKEN);

export const clearToken = () => localStorage.removeItem(REACT_APP_ACCESS_STORAGE_TOKEN);
