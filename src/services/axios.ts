import axios from "axios";
import { ApiUrls } from "../config/url";
import { getRefreshToken, getToken, removeRefreshToken, removeToken, setRefreshToken, setToken } from "../utils/token";
import { useAppStore } from "../store/app.store";

const api = axios.create({
  baseURL: ApiUrls.apiBaseUrl,
  withCredentials: true,
});

api.defaults.headers.post["Content-Type"] = "application/json";

let csrfToken: string | undefined;
let csrfRequest: Promise<string | undefined> | undefined;
let refreshRequest: Promise<any> | undefined;

const readCookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

const loadCsrfToken = async () => {
  csrfToken = csrfToken || readCookie("csrf_token");
  if (csrfToken) return csrfToken;
  if (!csrfRequest) {
    csrfRequest = axios
      .get(`${ApiUrls.apiBaseUrl}/auth/csrf-tokens`, { withCredentials: true })
      .then((response) => response.data?.data?.csrfToken as string | undefined)
      .finally(() => {
        csrfRequest = undefined;
      });
  }
  csrfToken = await csrfRequest;
  return csrfToken;
};

api.interceptors.request.use(async (config) => {
  const accessToken = getToken();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  const method = (config.method || "get").toLowerCase();
  const isSafeMethod = ["get", "head", "options"].includes(method);
  const isPublicAuthMutation = [
    "/auth/sessions",
    "/auth/registrations",
    "/auth/identity-providers/google/sessions",
    "/auth/identity-providers/facebook/sessions",
    "/auth/email-verifications",
    "/auth/email-verification-deliveries",
    "/auth/password-reset-requests",
    "/auth/password-resets",
    "/auth/session-refreshes",
  ].some((path) => config.url?.includes(path));
  if (!isSafeMethod && !isPublicAuthMutation) {
    const token = await loadCsrfToken();
    if (token) config.headers["X-CSRF-Token"] = decodeURIComponent(token);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const returnedToken = response.data?.data?.csrfToken;
    if (returnedToken) csrfToken = returnedToken;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRoute = ["auth/sessions", "auth/registrations", "auth/session-refreshes"]
      .some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !isAuthRoute && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        refreshRequest ||= axios
          .post(
            `${ApiUrls.apiBaseUrl}/auth/session-refreshes`,
            { token: getRefreshToken(), clientType: "spa" },
            { withCredentials: true },
          )
          .finally(() => {
            refreshRequest = undefined;
          });
        const refreshResponse = await refreshRequest;
        const nextAccessToken = refreshResponse.data?.data?.access_token;
        const nextRefreshToken = refreshResponse.data?.data?.refresh_token;
        if (nextAccessToken) setToken(nextAccessToken);
        if (nextRefreshToken) setRefreshToken(nextRefreshToken);
        csrfToken = refreshResponse.data?.data?.csrfToken || csrfToken;
        return api(originalRequest);
      } catch (refreshError: any) {
        removeToken();
        removeRefreshToken();
        useAppStore.getState().setUserData(null);
        if (window.location.pathname !== "/account/login") {
          window.location.href = "/account/login";
        }
        return Promise.reject(refreshError.response?.data || refreshError);
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
