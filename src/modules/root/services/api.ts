import type { BackendResponse, PaginatedBackendResponse } from "../../../libs/shared/types/backend-response";
import type { CategoryResponse, ProductResponse, ShockDealProducts, RecipeDetailResponse } from "../types/api-response";
import api from "../../../services/axios";
import type { PaginationRequest } from "../../../types/api-request";
import type { PaginationResponse } from "../../../types/api-response";
export const onGetCategoriesApi = async (
  limit?: number
): Promise<BackendResponse<CategoryResponse[]>> => {
  const res = await api.get("/categories", {
    params: limit ? { limit } : {}
  });
  return res.data;
};

export const ongetPopularProducts = async (
  limit?: number
): Promise<BackendResponse<ProductResponse[]>> => {
  const res = await api.get("/products", {
    params: { view: "popular", ...(limit ? { limit } : {}) }
  });
  return res.data;
};

export const onGetShockDealProducts = async (
  page: number = 1, 
  limit: number = 12
): Promise<PaginatedBackendResponse<ShockDealProducts[]>> => {
  const response = await api.get("/products", {
    params: { view: "deals", page, limit }
  });

  return response.data;
};

export const onGetSuggestionProducts = async (page: number = 1, limit: number = 12): Promise<PaginatedBackendResponse<ProductResponse[]>> => {
  const response = await api.get("/products", {
    params: { view: "suggested", page, limit }
  });
  return response.data;
}

export const onGetRecipeLastest = async() : Promise<BackendResponse<RecipeDetailResponse>> => {
  const data = await api.get("/recipes", { params: { view: "latest" } })
  return data.data
}

export const onAskChatbot = async (payload: { message: string, history: any[] }) => {
    const res = await api.post("/chatbot/messages", payload);
    return res.data;
}

export const onGetSpecialLatestProduct = async() : Promise<BackendResponse<ProductResponse>> => {
  const data = await api.get("/specials", { params: { view: "latest" } })
  return data.data
}
