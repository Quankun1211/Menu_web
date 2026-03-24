import type { BackendResponse } from "../libs/shared/types/backend-response";
import type { NotificationResponse, SearchProductResponse, UserRecord } from "../types/api-response";
import api from "./axios";

export const onGetMeApi = async (): Promise<BackendResponse<UserRecord>> => {
    const data = await api.get("/user/me")
    return data.data
}

export const onLogoutApi = async (): Promise<BackendResponse<{message: string}>> => {
    const data = await api.post("/auth/logout")
    return data.data
}
export const onSearchProducts = async (
  keyword: string, sort?: string
): Promise<BackendResponse<SearchProductResponse[]>> => {
  const { data } = await api.get('/product/search', {
    params: { q: keyword, sort: sort },
  });
  return data;
};
export const onGetNotification = async () : Promise<BackendResponse<NotificationResponse[]>> => {
    const data = await api.get("/notification/get")
    return data.data
}

export const onReadNotification = async (id: string): Promise<BackendResponse<NotificationResponse>> => {
  const data = await api.patch(`/notification/read/${id}`);
  return data.data;
};
export const onAskChatbot = async (payload: { message: string, history: any[] }) => {
    const res = await api.post("/ai/ask", payload);
    return res.data;
}
export const onReadAllNotification = async (): Promise<BackendResponse<NotificationResponse>> => {
  const data = await api.patch(`/notification/read-all`);
  return data.data;
};