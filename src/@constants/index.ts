export const PATHS = {
    login: "/login",
    register: "/register",
    categories: {
        default: "/categories",
        show: "show/:id",
        create: "create",
        edit: "edit/:id",
    },
};
export const RESOURCES = {
    categories: "categories",
    products: "products",
};

export const TOKEN_KEY = "accessToken";

const AUTH_ROUTE = "/auth";

export const LOGIN_END_POINT = `${AUTH_ROUTE}/login`;
export const REGISTER_END_POINT = `${AUTH_ROUTE}/register`;
export const REFRESH_END_POINT = `${AUTH_ROUTE}/refreshToken`;
export const PROFILE_END_POINT = `${AUTH_ROUTE}/me`;
export const LOGOUT_END_POINT = `${AUTH_ROUTE}/logout`;

export const CATEGORY_ROUTE = "/categories";
export const CATEGORIES_END_POINT = `${CATEGORY_ROUTE}`;
