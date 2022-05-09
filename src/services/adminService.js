import apiClient from "../utils/apiClient";

export const createAdmin = async (email, password) => {
  try {
    const response = await apiClient.post("/admin/create_admin_profile", {
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

export const getCustomersInfo = async (page, limit) => {
  try {
    const response = await apiClient.get(
      `/admin/get_customers_info?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerDetails = async (id) => {
  try {
    const response = await apiClient.get(`/admin/get_customer_info/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchCustomerDetails = async (email) => {
  try {
    const response = await apiClient.get(
      `/admin/search_customer_email?email=${email}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAllAdminProfiles = async (page, limit) => {
  try {
    const response = await apiClient.get(
      `/admin/get_admin_accounts?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAdminProfileDetails = async (id) => {
  try {
    const response = await apiClient.get(`/admin/get_admin_account/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchAdminProfile = async (email) => {
  try {
    const response = await apiClient.get(
      `/admin/search_admin_email?email=${email}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getAdminRoles = async () => {
  try {
    const response = await apiClient.get(`/admin/view_roles`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createAdminProfile = async (payload) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      branchId,
      roleName,
      roleId,
      loanOfficerCode,
      staffId,
      rank,
    } = payload;
    const response = await apiClient.post("/admin/create_admin_profile", {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      branchId,
      roleName,
      roleId,
      loanOfficerCode,
      staffId,
      rank,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateAdminProfile = async (id, payload) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      branchId,
      roleName,
      roleId,
      loanOfficerCode,
      staffId,
      rank,
    } = payload;
    const response = await apiClient.put(`/admin/update_admin_account/${id}`, {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      branchId,
      roleName,
      roleId,
      loanOfficerCode,
      staffId,
      rank,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const editCustomerInfo = async (id, payload) => {
  try {
    const {
      email,
      firstname,
      middlename,
      lastname,
      phone,
      bvnhash,
      dob,
      pob,
      branch,
      gender,
      rank,
      genotype,
      blood_group,
      security_number,
      nhis_number,
    } = payload;
    const response = await apiClient.put(`/admin/edit_customer_info/${id}`, {
      email,
      firstname,
      middlename,
      lastname,
      phone,
      bvnhash,
      dob,
      pob,
      branch,
      gender,
      rank,
      genotype,
      blood_group,
      security_number,
      nhis_number,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const deleteAdminAccount = async (id) => {
  try {
    const response = await apiClient.delete(
      `/admin/delete_admin_account/${id}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
