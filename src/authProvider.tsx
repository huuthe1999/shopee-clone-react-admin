import { PATHS, TOKEN_KEY } from "@constants";
import { AuthBindings } from "@refinedev/core";
import { message } from "antd";
import axios, { AxiosError } from "axios";
import { IBaseErrorResponse, ILoginCredential } from "interfaces";
import { logOutService, loginService } from "services/auth";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "utils";

export const authProvider: AuthBindings = {
    login: async ({ email, password }: ILoginCredential) => {
        try {
            const { data } = await loginService({ email, password });

            const accessToken = data.data.accessToken;
            setLocalStorage(TOKEN_KEY, accessToken);

            return {
                success: true,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = (error as AxiosError<IBaseErrorResponse>)
                    .response?.data.message as string;
                const errors = (error as AxiosError<IBaseErrorResponse>)
                    .response?.data?.errors;

                if (errors) {
                    return {
                        success: false,
                        error: {
                            message,
                            name: Object.values(errors[0])[0],
                        },
                    };
                }
                return {
                    success: false,
                    error: {
                        message,
                        name: "Vui lòng thử lại",
                    },
                };
            }

            return {
                success: false,
            };
        }
    },
    async logout() {
        const token = getLocalStorage(TOKEN_KEY);
        if (token) {
            try {
                const { data } = await logOutService();
                if (data.isSuccess) {
                    removeLocalStorage(TOKEN_KEY);
                    message.success(data.message);
                }
                return {
                    success: true,
                    redirectTo: PATHS.login,
                };
            } catch (error) {
                return {
                    success: false,
                };
            }
        }

        removeLocalStorage(TOKEN_KEY);
        return {
            success: true,
        };
    },
    async check() {
        const token = getLocalStorage(TOKEN_KEY);
        if (token) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            error: {
                message: "Check failed",
                name: "Token not found",
            },
            logout: true,
            redirectTo: PATHS.login,
        };
    },
    async onError(error) {
        console.log("🚀 ~ onError ~ error:", error);

        if (error.statusCode === 401) {
            return {
                logout: true,
                error,
            };
        }

        return {
            error,
        };
    },
    async register({ email, password }) {
        return { success: false, redirectTo: undefined };
    },
};
