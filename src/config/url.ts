import env from "./envConfig";

export const ApiUrls = {
    apiBaseUrl: env.apiBaseUrl,
    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        register: "/auth/register",
        refreshToken: "/auth/refresh"
    },
    user: {
        queryProfile: "/users/:$1",
        updateProfile: "/users/me"
    },
    tags: {
        getTags: "/tag"
    }
}
