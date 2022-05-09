import apiClient from "../utils/apiClient";
import {
  setLoanToken,
  setRoles,
  setToken,
  setLoanRoles,
  setBranchId,
  setAdminEmail,
  setAdminName,
} from "../utils/localStorageService";
import notify from "../utils/notification";

export const signInAdmin = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/admin_sign_in", {
      email,
      password,
    });
    const { token, roles, loanRoles, branch, adminName } = response.data;

    console.log(response);

    if (response.data.statusCode && response.data.statusCode === 401) {
      notify(response.data.message, "error");
      return;
    }

    setToken(token);
    setRoles([...roles]);
    setLoanToken(token);
    setLoanRoles([...loanRoles]);
    setBranchId(branch);
    setAdminEmail(email);
    setAdminName(adminName);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetAdminPassword = async (old_password, new_password) => {
  try {
    const response = await apiClient.post("/auth/change_admin_password", {
      old_password,
      new_password,
    });
    //const token = response.data.token;
    //setToken(token);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const initiatePasswordRest = async () => {
  try {
    const response = await apiClient.post(
      "/auth/initiate_admin_password_reset",
      {}
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const generateCustomerToken = async (customer_id) => {
  try {
    const response = await apiClient.post("/auth/user_admin_auth", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
