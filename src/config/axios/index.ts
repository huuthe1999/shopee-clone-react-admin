import { LOGIN_END_POINT, REGISTER_END_POINT, TOKEN_KEY } from "@constants";
import { HttpError } from "@refinedev/core";
import axios, { AxiosRequestConfig } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { refreshTokenService } from "services/auth";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "utils";

const config: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
};

const axiosInstance = axios.create(config);

export const authAxiosInstance = axios.create({
    ...config,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (request: AxiosRequestConfig) => {
        if (request.url?.includes(LOGIN_END_POINT || REGISTER_END_POINT)) {
            request.baseURL = process.env.REACT_APP_AUTH_URL;
        }

        // Retrieve the token from local storage
        const token = getLocalStorage(TOKEN_KEY);
        if (token) {
            // Check if the header property exists
            if (request.headers) {
                // Set the Authorization header if it exists
                request.headers["Authorization"] = `Bearer ${token}`;
            } else {
                // Create the headers property if it does not exist
                request.headers = {
                    Authorization: `Bearer ${token}`,
                };
            }
        }

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    }
);

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest: any) => {
    try {
        const { data } = await refreshTokenService();
        setLocalStorage(TOKEN_KEY, data.data.accessToken);

        failedRequest.response.config.headers["Authorization"] =
            "Bearer " + data.data.accessToken;
        return Promise.resolve();
    } catch (error) {
        removeLocalStorage(TOKEN_KEY);
        return Promise.reject(error);
    }
};
// const refreshAuthLogic = (failedRequest: any) =>
//     refreshTokenService()
//         .then((data) => {
//             setLocalStorage(TOKEN_KEY, data.data.data.accessToken);
//             failedRequest.response.config.headers["Authorization"] =
//                 "Bearer " + data.data.data.accessToken;
//             return Promise.resolve();
//         })
//         .catch((error) => {
//             return Promise.reject(failedRequest);
//         });

// Instantiate the interceptor
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
    statusCodes: [401, 403],
    shouldRefresh(error) {
        return error.message === "TOKEN_EXPIRED";
    },
    // pauseInstanceWhileRefreshing: false,
    interceptNetworkError: true,
});
export default axiosInstance;
