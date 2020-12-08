import axios from 'axios';
import {getAccessToken,clearToken} from './localStorageService';

const { REACT_APP_API_BASE_URL } = process.env;

const apiClient = axios.create({
    baseURL: REACT_APP_API_BASE_URL,
    timeout: 40000
});

apiClient.interceptors.request.use(
    config => {
        // get token
        const token = getAccessToken();

        //create new config object; setting header
        const newConfig = {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${token}` || ''
            }
        };
        //return new config object
        return newConfig;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => response,
    error => {
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
        if (error.response?.status === 401) clearToken();
        if (error.response?.data) {
            return Promise.reject(error.response?.data);
        };
        return Promise.reject(error);
    }
);


export default apiClient;