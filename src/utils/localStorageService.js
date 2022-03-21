const {
  REACT_APP_ACCESS_STORAGE_TOKEN,
  REACT_APP_ACCESS_LOAN_STORAGE_TOKEN,
  REACT_APP_ADMIN_ROLE,
  REACT_APP_LOAN_ROLE,
  REACT_APP_BRANCH_ID,
  REACT_APP_ADMIN_EMAIL,
  REACT_APP_ADMIN_NAME,
} = process.env;

//Admin token storage
export const setToken = (token) =>
  localStorage.setItem(REACT_APP_ACCESS_STORAGE_TOKEN, token);
export const getAccessToken = () =>
  localStorage.getItem(REACT_APP_ACCESS_STORAGE_TOKEN);
export const clearToken = () =>
  localStorage.removeItem(REACT_APP_ACCESS_STORAGE_TOKEN);

//Admin email storage
export const setAdminEmail = (email) =>
  localStorage.setItem(REACT_APP_ADMIN_EMAIL, email);
export const getAdminEmail = () => localStorage.getItem(REACT_APP_ADMIN_EMAIL);
export const clearEmail = () => localStorage.removeItem(REACT_APP_ADMIN_EMAIL);

//Amin name storage
export const setAdminName = (name) =>
  localStorage.setItem(REACT_APP_ADMIN_NAME, name);
export const getAdminName = () => localStorage.getItem(REACT_APP_ADMIN_NAME);
export const clearName = () => localStorage.removeItem(REACT_APP_ADMIN_NAME);

//Loan token storage
export const setLoanToken = (token) =>
  localStorage.setItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN, token);
export const getLoanAccessToken = () =>
  localStorage.getItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN);
export const clearLoanToken = () =>
  localStorage.removeItem(REACT_APP_ACCESS_LOAN_STORAGE_TOKEN);

//Admin role storage
export const setRoles = (roles) =>
  localStorage.setItem(REACT_APP_ADMIN_ROLE, roles);
export const getRoles = () => localStorage.getItem(REACT_APP_ADMIN_ROLE);
export const clearRoles = () => localStorage.removeItem(REACT_APP_ADMIN_ROLE);

//Loan officer role storage
export const setLoanRoles = (loanRoles) =>
  localStorage.setItem(REACT_APP_LOAN_ROLE, loanRoles);
export const getLoanRoles = () => localStorage.getItem(REACT_APP_LOAN_ROLE);
export const clearLoanRoles = () =>
  localStorage.removeItem(REACT_APP_LOAN_ROLE);

//Admin branch id storage
export const setBranchId = (branchId) =>
  localStorage.setItem(REACT_APP_BRANCH_ID, branchId);
export const getBranchId = () => localStorage.getItem(REACT_APP_BRANCH_ID);
export const clearBranchId = () => localStorage.removeItem(REACT_APP_BRANCH_ID);

//Clear tokens and storage
export const clearAllTokens = () =>
  clearLoanToken() &&
  clearToken() &&
  clearRoles() &&
  clearLoanRoles() &&
  clearBranchId() &&
  clearEmail();
