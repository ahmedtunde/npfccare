import { loanApiClient } from "../utils/apiClient";
import { getAccessToken, setLoanToken } from "../utils/localStorageService";

export const getPendingLoans = async () => {
  try {
    const response = await loanApiClient.get("pending-loanapplications", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    if (response?.data?.data?.token?.data)
      setLoanToken(response?.data?.data?.token?.data);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getSingleLoanEntry = async (loanApplicationId) => {
  try {
    const response = await loanApiClient.get(
      `loanapplication/${loanApplicationId}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getRoles = async () => {
  try {
    const response = await loanApiClient.get(`roles`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await loanApiClient.get(`role/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanProductCategory = async (id) => {
  try {
    const response = await loanApiClient.get(`loanproductcategory/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateLoanProductCategory = async (id) => {
  try {
    const response = await loanApiClient.put(`loanproductcategory/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanProductCategories = async () => {
  try {
    const response = await loanApiClient.get(`loanproductcategories`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanProductCategoriesByCategoryType = async (categoryType) => {
  try {
    const response = await loanApiClient.get(
      `loanproductcategories/${categoryType}`
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBasicinfos = async () => {
  try {
    const response = await loanApiClient.get(`baseinfos`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBasicinfoById = async (id) => {
  try {
    const response = await loanApiClient.get(`baseinfo/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateBasicinfoById = async (id) => {
  try {
    const response = await loanApiClient.put(`baseinfo/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createLoanproduct = async (data) => {
  try {
    const {
      name,
      interestRate,
      maxTerm,
      maxTermUnit,
      limit,
      repaymentReqmt,
      guarantorsCnt,
      loanProductCategory_id,
    } = data;
    const response = await loanApiClient.post(`loanproduct`, {
      name,
      interestRate,
      maxTerm,
      maxTermUnit,
      limit,
      repaymentReqmt,
      guarantorsCnt,
      loanProductCategory_id,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateLoanproduct = async (data, id) => {
  try {
    const {
      name,
      interestRate,
      maxTerm,
      maxTermUnit,
      limit,
      repaymentReqmt,
      guarantorsCnt,
      loanProductCategory_id,
    } = data;

    const response = await loanApiClient.put(`loanproduct/${id}`, {
      name,
      interestRate,
      maxTerm,
      maxTermUnit,
      limit,
      repaymentReqmt,
      guarantorsCnt,
      loanProductCategory_id,
    });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanproducts = async () => {
  try {
    const response = await loanApiClient.get(`loanproducts`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanproductById = async (id) => {
  try {
    const response = await loanApiClient.get(`loanproduct/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCriteriaById = async (id) => {
  try {
    const response = await loanApiClient.get(`criteria/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCriterias = async () => {
  try {
    const response = await loanApiClient.get(`criterias`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const updateCriteriaById = async (id) => {
  try {
    const response = await loanApiClient.put(`criteria/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createBranch = async (data) => {
  try {
    const { code, name } = data;

    const response = await loanApiClient.post(`branch`, { code, name });

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBranchById = async (id) => {
  try {
    const response = await loanApiClient.get(`branch/${id}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBranches = async () => {
  try {
    const response = await loanApiClient.get(`branches`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const attachCriteriaToLoanproduct = async (data, productId) => {
  const { code, scoreType, requirements, maxScore, inputType } = data;
  try {
    const response = await loanApiClient.post(
      `attach-criteria-to-loanproduct/${productId}`,
      { code, scoreType, requirements, maxScore, inputType }
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loanRepaymentSchedule = async (arrangementID) => {
  try {
    const response = await loanApiClient.get(
      `loan-repayment-schedule?arrangementID=${arrangementID}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanDetails = async (loanAccount) => {
  try {
    const response = await loanApiClient.get(
      `loan-details?Customer=${loanAccount}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const approveOrRejectLoan = async (data, loanAppId, customerId) => {
  try {
    const {
      status,
      narrative,
      isWithinLimit,
      email,
      firstname,
      lastname,
      productName,
    } = data;
    const response = await loanApiClient.put(
      `approve-reject-loan/${loanAppId}/${customerId}`,
      {
        status,
        narrative,
        isWithinLimit,
        email,
        firstname,
        lastname,
        productName,
      }
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loanScoring = async (loanAppId) => {
  try {
    const response = await loanApiClient.post(`loanscore/${loanAppId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanScorecard = async (loanAppId) => {
  try {
    const response = await loanApiClient.get(`loan-scorecard/${loanAppId}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanStatus = async (loanAppId) => {
  try {
    const response = await loanApiClient.get(`loan-status/${loanAppId}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const bookApprovedLoan = async (data, loanAppId, customerId) => {
  try {
    const {
      approvedAmount,
      approvedTenure,
      token,
      email,
      productName,
      firstname,
      lastname,
      applicationDate,
    } = data;

    const response = await loanApiClient.post(
      `book-approved-loan/${loanAppId}/${customerId}`,
      {
        approvedAmount,
        approvedTenure,
        token,
        email,
        productName,
        firstname,
        lastname,
        applicationDate,
      }
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLoanScore = async (loanAppId) => {
  try {
    const response = await loanApiClient.get(`loanscore/${loanAppId}`);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
