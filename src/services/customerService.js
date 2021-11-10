import { isValidDate } from "../components/utilities";
import apiClient from "../utils/apiClient";

export const getDocTypes = async () => {
  try {
    const response = await apiClient.get(`/signup/get_doc_types`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomers = async (channel = "", reg_complete = "") => {
  try {
    const response = await apiClient.get(
      `/support/view_customers?channel=${channel}&reg_complete=${reg_complete}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const searchCustomers = async (searchPhrase) => {
  try {
    const response = await apiClient.get(
      `/support/search_customers?searchPhrase=${searchPhrase}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomer = async (customer_id) => {
  try {
    const response = await apiClient.get(
      `/support/view_customer?customer_id=${customer_id}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerBankAcc = async (customer_id) => {
  try {
    const response = await apiClient.get(
      `/support/view_customer_bank_accounts?customer_id=${customer_id}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerLogs = async (customer_id) => {
  try {
    const response = await apiClient.get(
      `/support/view_customer_logs?customer_id=${customer_id}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/liveliness_check", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerLiveliness = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/liveliness_uncheck", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/documents_check", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerDocuments = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/documents_uncheck", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerSignature = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/signature_check", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerSignature = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/signature_uncheck", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const confirmCustomerPhoto = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/photo_check", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const rejectCustomerPhoto = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/photo_uncheck", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/enable_customer", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const disableCustomer = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/disable_customer", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const enforcePND = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/enforce_pnd", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const removePND = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/remove_pnd", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const editTransferLimitValue = async (customer_id, transfer_limit) => {
  try {
    const response = await apiClient.post("/transfer_limit", {
      customer_id,
      transfer_limit,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetCustomerPassword = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/reset_password", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unlockCustomerAccount = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/unlock_account", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const unlinkCustomerDevice = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/reset_device", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const resetCustomerTxnPIN = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/reset_pin", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const syncCustomerInfo = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/update_customer_info", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadCustomerSignature = async (formData) => {
  try {
    const response = await apiClient.post(
      "/support/create_signature",
      formData
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadCustomerPhoto = async (formData) => {
  try {
    const response = await apiClient.post("/support/create_photo", formData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 *
 * @param {FormData} formData
 */
export const uploadCustomerIdDocument = async (formData) => {
  try {
    const response = await apiClient.post("/support/create_document", formData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const uploadCustomerLivelinessVideo = async (formData) => {
  try {
    const response = await apiClient.post("/support/create_video", formData);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const completeCustomerSignup = async (customer_id) => {
  try {
    const response = await apiClient.post("/support/complete_user_signup", {
      customer_id,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Export Customers Data
 *
 * @param {Object} exportParams
 * @param {number[]} [exportParams.customer_ids=[]] - array of customers id eg: [1,2]
 * @param {Date} [exportParams.start_date=""] - start date for filter eg: 2021-03-04
 * @param {Date} [exportParams.end_date=""] - end date for filter eg: 2021-03-05
 * @returns {Promise<File>} file of customers data
 */

export const getExportCustomersData = async ({
  customer_ids = [],
  start_date = "",
  end_date = "",
}) => {
  //   let headers = {
  //     "Accept": "application/json, text/plain, */*",
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${getAccessToken()}`,
  // };

  // try {
  //     const response = await fetch('http://20.42.119.47:8282/api/v1/analytics/export_customers', {
  //         method: "POST",
  //         body: JSON.stringify(customer_ids),
  //         headers
  //     });
  //     if (response.status === 401) {
  //         return response;
  //     }
  //     else {
  //         return response.blob();
  //     }
  // } catch (error) {
  //     return Promise.reject(error);
  // }
  try {
    start_date = isValidDate(start_date)
      ? start_date.toISOString()
      : start_date;
    end_date = isValidDate(end_date) ? end_date.toISOString() : end_date;
    customer_ids = `${customer_ids}`;

    const response = await apiClient.get(
      `/analytics/export_customers?${
        customer_ids ? `customer_ids=${customer_ids}&` : ""
      }${start_date ? `start_date=${start_date}&` : ""}${
        end_date ? `end_date=${end_date}` : ""
      }`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCustomerBillings = async (customer_id) => {
  try {
    const response = await apiClient.get(
      `/biller_support/bill_payments?customer_id=${customer_id}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBillingStatus = async (rrr) => {
  try {
    const response = await apiClient.get(
      `/biller_support/transaction_status?rrr=${rrr}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getFailedBillings = async () => {
  try {
    const response = await apiClient.get(`/biller_support/failed_transactions`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
