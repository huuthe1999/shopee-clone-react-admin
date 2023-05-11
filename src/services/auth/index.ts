import { LOGIN_END_POINT, REFRESH_END_POINT } from "@constants";
import { axiosInstance } from "config";
import {
    ILoginCredential,
    ILoginResponse,
    IRefreshTokenResponse,
} from "interfaces";

export const loginService = (credential: ILoginCredential) =>
    axiosInstance.post<ILoginResponse>(LOGIN_END_POINT, credential, {
        withCredentials: true,
    });

export const refreshTokenService = () =>
    axiosInstance.get<IRefreshTokenResponse>(REFRESH_END_POINT, {
        withCredentials: true,
    });
