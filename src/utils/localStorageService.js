const {
  REACT_APP_ACCESS_STORAGE_TOKEN,
  REACT_APP_ACCESS_LOAN_STORAGE_TOKEN,
  REACT_APP_ADMIN_ROLE,
} = process.env;

export const setToken = (token) =>
  localStorage.setItem(REACT_APP_ACCESS_STORAGE_TOKEN, token);

export const getAccessToken = () =>
  localStorage.getItem(REACT_APP_ACCESS_STORAGE_TOKEN);

export const clearToken = () =>
  localStorage.removeItem(REACT_APP_ACCESS_STORAGE_TOKEN);

export const setLoanToken = (token) =>
  localStorage.setItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN, token);

export const getLoanAccessToken = () =>
  localStorage.getItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN);

export const clearLoanToken = () =>
  localStorage.removeItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN);

export const setRoles = (roles) =>
  localStorage.setItem(REACT_APP_ADMIN_ROLE, roles);

export const getRoles = () => localStorage.getItem(REACT_APP_ADMIN_ROLE);

export const clearRoles = () => localStorage.removeItem(REACT_APP_ADMIN_ROLE);

export const clearAllTokens = () =>
  clearLoanToken() && clearToken() && clearRoles();
