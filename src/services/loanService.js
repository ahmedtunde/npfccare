import { loanApiClient } from "../utils/apiClient";
import { getAccessToken, setLoanToken } from "../utils/localStorageService";

export const getPendingLoans = async () => {
  try {
    const response = await loanApiClient.get("/pending-loanapplications", {
      headers: {
        Authorization: getAccessToken(),
      },
    });
    console.log(response);
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
      `/loanapplication-pending/${loanApplicationId}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
