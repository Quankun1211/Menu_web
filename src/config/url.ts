import env from "./envConfig";

export const ApiUrls = {
    apiBaseUrl: env.apiBaseUrl,
    auth: {
        login: "/auth/sessions",
        logout: "/auth/sessions",
        register: "/auth/registrations",
        refreshToken: "/auth/session-refreshes"
    },
    user: {
        queryProfile: "/users/:$1",
        updateProfile: "/users/me"
    },
    tags: {
        getTags: "/tag"
    }
}
