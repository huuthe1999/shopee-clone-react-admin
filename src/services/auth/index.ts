import {
    LOGIN_END_POINT,
    LOGOUT_END_POINT,
    REFRESH_END_POINT,
} from "@constants";
import { axiosInstance } from "config";
import {
    IBaseResponse,
    ILoginCredential,
    ILoginResponse,
    IRefreshTokenResponse,
} from "interfaces";

export const loginService = (credential: ILoginCredential) =>
    axiosInstance.post<ILoginResponse>(LOGIN_END_POINT, credential, {
        withCredentials: true,
    });

export const logOutService = () =>
    axiosInstance.post<IBaseResponse>(LOGOUT_END_POINT, undefined, {
        withCredentials: true,
    });

export const refreshTokenService = () =>
    axiosInstance.get<IRefreshTokenResponse>(REFRESH_END_POINT, {
        withCredentials: true,
    });
