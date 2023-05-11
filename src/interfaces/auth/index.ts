import { IBaseResponse, IUser } from "interfaces";

export interface ILoginResponse extends IBaseResponse {
    data: {
        accessToken: string;
        expiresIn: number;
        user: IUser;
    };
}

export interface ILoginCredential {
    email: string;
    password: string;
}

export interface IRefreshTokenResponse extends IBaseResponse {
    data: {
        accessToken: string;
    };
}
