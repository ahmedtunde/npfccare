import axios from "axios";
import {
  getAccessToken,
  getLoanAccessToken,
  clearAllTokens,
} from "./localStorageService";

const { REACT_APP_API_BASE_URL, REACT_APP_LOAN_API_BASE_URL } = process.env;

const createApiCients = (baseURL, getToken, clearToken) => {
  const newApiClient = axios.create({
    baseURL,
    timeout: 40000,
  });

  newApiClient.interceptors.request.use(
    (config) => {
      const token = getToken();
      const headerToken = config.headers.Authorization;
      //create new config object; setting header
      const newConfig = {
        ...config,
        headers: {
          ...config.headers,
          Authorization: headerToken || token || "",
        },
        validateStatus: (status) => {
          // console.log(status);
          return true;
        },
      };
      //return new config object
      return newConfig;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  newApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // if our server returns a 403 forbidden response
      /**
       * error.response = {
       *  "data":{},
       * "status": 403,
       * "statusText": "Forbidden",
       * "headers": {},
       * "config": {
       *  "url": "/api/users/cilozulu",
       *  "method": "get",
       *  "headers": {
       *      "Accept": "",
       *      "x-access-token": ""
       *   },
       * "baseURL": ""
       * }
       * and someother parameters
       */
      // console.log("Interceptor error", Object.entries(error));
      if (error.response?.status === 401 || error.response?.status === 400)
        clearToken();
      if (error.response?.data) {
        return Promise.reject(error.response?.data);
      }
      return Promise.reject(error);
    }
  );
  return newApiClient;
};

const apiClient = createApiCients(
  REACT_APP_API_BASE_URL,
  () => `Bearer ${getAccessToken()}`,
  clearAllTokens
);

export const loanApiClient = createApiCients(
  REACT_APP_LOAN_API_BASE_URL,
  getLoanAccessToken,
  clearAllTokens
);

export const adminLoanApiClient = createApiCients(
  REACT_APP_LOAN_API_BASE_URL,
  getAccessToken,
  clearAllTokens
);

export default apiClient;
