import { BackendResponse, PaginatedBackendResponse } from "@/libs/shared/types/backend-response";
import { OrderResponse, OrderDetailResponse } from "../types/api-response";
import api from "../../../services/axios";
import { CancelOrderRequest } from "../types/api-request";
export const onGetMyOrders = async (page = 1, limit = 10, status = "all"): Promise<
  PaginatedBackendResponse<OrderResponse[]>
> => {
  const res = await api.get("/orders", { params: { page, limit, status } });
  return res.data;
};

export const onGetOrderDetail = async (orderId?: string) 
: Promise<BackendResponse<OrderDetailResponse>> => {
  const data = await api.get(`/orders/${orderId}`)
  return data.data
}

export const onCancelOrder = async(
  payload: CancelOrderRequest
) : Promise<BackendResponse<OrderResponse>> => {
  const data = await api.patch(`/orders/${payload.orderId}/cancellation`, {
    reason: payload.reason
  })
  return data.data
}
