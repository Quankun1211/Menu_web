import { BackendResponse, GetProductByRegionParams, PaginatedBackendResponse } from "@/libs/shared/types/backend-response";
import { CategoryMenuResponse, CategoryRecipeResponse, CategoryResponse, MenuResponse, ProductResponse, RecipeDetailResponse, RecipeResponse } from "../types/api-response";
import api from "../../../services/axios";

type GetProductByCategoryParams = {
  categoryId?: string;
  sort?: string;
};

type GetProductSpecialByRegionParams = {
  region: string;
  sort?: string;
  page?: number;
  limit?: number;
};

export const onGetProductByCategory = async (
  params?: GetProductByCategoryParams
): Promise<BackendResponse<ProductResponse[]>> => {
  const { data } = await api.get("/products/by-category", {
    params: {
      categoryId: params?.categoryId,
      sort: params?.sort,
    },
  });

  return data;
};

export const onGetCategoryMenuApi = async (
): Promise<BackendResponse<CategoryMenuResponse[]>> => {
  const res = await api.get("/menu-categories")
  return res.data;
};

export const onGetCategoryRecipeApi = async (
): Promise<BackendResponse<CategoryRecipeResponse[]>> => {
  const res = await api.get("/recipes/categories")
  return res.data;
};

export const onGetProductByRegion = async (
  params?: GetProductByRegionParams
): Promise<PaginatedBackendResponse<ProductResponse[]>> => {
  const res = await api.get("/products/by-region", {
    params: {
      region: params?.region,
      categoryId: params?.categoryId,
      sort: params?.sort,
      page: params?.page,
      limit: params?.limit,
    },
  });

  return res.data;
};

export const onGetMenuApi = async (
  categoryId: string,
  page = 1,
  limit = 12,
): Promise<PaginatedBackendResponse<MenuResponse[]>> => {
  const res = await api.get("/menus", {
    params: { categoryId, page, limit },
  });
  return res.data;
};

export const onGetRecipeApi = async (
  categoryId: string,
  page = 1,
  limit = 12,
): Promise<PaginatedBackendResponse<RecipeDetailResponse[]>> => {
  const res = await api.get("/recipes/by-category", {
    params: { categoryId, page, limit },
  });
  return res.data;
};

export const onGetMenuDetailApi = async (
  id: string
): Promise<BackendResponse<MenuResponse>> => {
  const res = await api.get(`/menus/${id}`);
  return res.data;
};

export const onGetRecipeDetailApi = async (
  id: string
): Promise<BackendResponse<RecipeDetailResponse>> => {
  const res = await api.get(`/recipes/${id}`);
  return res.data;
};

export const onSaveRecipeApi = async (
  recipeId: string
): Promise<BackendResponse<RecipeResponse>> => {
  const res = await api.post(`/recipes/${recipeId}/saved-state`);
  return res.data;
};

export const onGetProductDetail = async (id: string)
: Promise<BackendResponse<ProductResponse>> => {
  const data = await api.get(`/products/${id}`);
  return data.data;
};

export const onTrackView = async (categoryId: string) => {
  const data = await api.post("/users/view-history", {
    categoryId
  })
  return data.data
}

export const onGetProductSpecialByRegion = async (
  params?: GetProductSpecialByRegionParams
): Promise<PaginatedBackendResponse<ProductResponse[]>> => {
  const res = await api.get("/specials", {
    params: {
      region: params?.region,
      sort: params?.sort,
      page: params?.page,
      limit: params?.limit,
    },
  });

  return res.data;
};

export const onGetSpecialDetail = async (
  id: string
): Promise<BackendResponse<ProductResponse>> => {
  const res = await api.get(`/specials/${id}`);
  return res.data;
};
