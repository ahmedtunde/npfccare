import apiClient from "../utils/apiClient";

export const createAdmin = async (email, password) => {
  try {
    const response = await apiClient.post("/admin/create_admin", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const mapAdminRole = async (name, roleId, adminUserId) => {
  try {
    const response = await apiClient.post("/admin/assign_role", {
      name,
      roleId,
      adminUserId,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createAdminRole = async (name) => {
  try {
    const response = await apiClient.post("/admin/create_role", { name });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
