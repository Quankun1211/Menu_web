import type { BackendResponse } from "../libs/shared/types/backend-response";
import type { NotificationResponse, SearchProductResponse, UserRecord } from "../types/api-response";
import api from "./axios";
import { getRefreshToken } from "../utils/token";

export const onGetMeApi = async (): Promise<BackendResponse<UserRecord>> => {
    const data = await api.get("/users/me")
    return data.data
}

export const onLogoutApi = async (): Promise<BackendResponse<{message: string}>> => {
    const data = await api.delete("/auth/sessions", { data: { token: getRefreshToken() } })
    return data.data
}
export const onSearchProducts = async (
  keyword: string, sort?: string
): Promise<BackendResponse<SearchProductResponse[]>> => {
  const { data } = await api.get('/products', {
    params: { q: keyword, sort: sort },
  });
  return data;
};
export const onGetNotification = async () : Promise<BackendResponse<NotificationResponse[]>> => {
    const data = await api.get("/notifications")
    return data.data
}

export const onReadNotification = async (id: string): Promise<BackendResponse<NotificationResponse>> => {
  const data = await api.patch(`/notifications/${id}`);
  return data.data;
};
export const onReadAllNotification = async (): Promise<BackendResponse<NotificationResponse>> => {
  const data = await api.patch(`/notifications`);
  return data.data;
};
export const onAskChatbot = async (payload: { message: string, history: any[] }) => {
    const res = await api.post("/chatbot/messages", payload);
    return res.data;
}
