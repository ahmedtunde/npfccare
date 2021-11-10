const {
  REACT_APP_ACCESS_STORAGE_TOKEN,
  REACT_APP_ACCESS_LOAN_STORAGE_TOKEN,
  REACT_APP_ACCESS_ADMIN_EMAIL,
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

export const setAdminEmail = (email) =>
  localStorage.setItem(REACT_APP_ACCESS_ADMIN_EMAIL, email);

export const getAdminEmail = () =>
  localStorage.getItem(REACT_APP_ACCESS_ADMIN_EMAIL);

export const clearAdminEmail = () =>
  localStorage.removeItem(REACT_APP_ACCESS_ADMIN_EMAIL);

export const clearAllTokens = () =>
  clearLoanToken() && clearToken() && clearAdminEmail();
