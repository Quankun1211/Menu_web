import api from "../../../services/axios";
import { CartRequest, RemoveCartItemsRequest, UpdateCartQuantityRequest } from "../types/api-request";
import { BackendResponse } from "@/libs/shared/types/backend-response";
import { CartResponse, RemoveCartItemsResponse } from "../types/api-response";

export const onAddToCart = async (
  payload: CartRequest
): Promise<BackendResponse<CartResponse[]>> => {
  const { data } = await api.post("/cart/items", payload);
  return data;
};

export const onGetCart = async (): Promise<CartResponse> => {
  const { data } = await api.get("/cart");
  return data;
};
export const onRemoveCartItems = async (
  payload: RemoveCartItemsRequest
): Promise<RemoveCartItemsResponse> => {
  const { data } = await api.delete("/cart/items", { data: payload });
  return data;
};
export const onUpdateCartQuantity = async (
  payload: UpdateCartQuantityRequest
) => {
  const { data } = await api.patch("/cart/items", payload);
  return data;
};
