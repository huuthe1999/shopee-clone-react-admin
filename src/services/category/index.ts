import { CATEGORY_ROUTE, LOGIN_END_POINT } from "@constants";
import { authAxiosInstance, axiosInstance } from "config";
import {
    ILoginCredential,
    ILoginResponse,
    IRefreshTokenResponse,
} from "interfaces";

export const getCategories1Service = (credential: ILoginCredential) =>
    axiosInstance.post<ILoginResponse>(LOGIN_END_POINT, credential);

export const getCategoriesService = (path: string) =>
    authAxiosInstance.get<IRefreshTokenResponse>(`${CATEGORY_ROUTE}/${path}`);
