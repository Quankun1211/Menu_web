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
};

export const onGetProductByCategory = async (
  params?: GetProductByCategoryParams
): Promise<BackendResponse<ProductResponse[]>> => {
  const { data } = await api.get("/product/get-by-category", {
    params: {
      categoryId: params?.categoryId,
      sort: params?.sort,
    },
  });

  return data;
};

export const onGetCategoryMenuApi = async (
): Promise<BackendResponse<CategoryMenuResponse[]>> => {
  const res = await api.get("/menu/category/get")
  return res.data;
};

export const onGetCategoryRecipeApi = async (
): Promise<BackendResponse<CategoryRecipeResponse[]>> => {
  const res = await api.get("/menu/recipe/category/get")
  return res.data;
};

export const onGetProductByRegion = async (
  params?: GetProductByRegionParams
): Promise<PaginatedBackendResponse<ProductResponse[]>> => {
  const res = await api.get("/product/get-by-region", {
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
  categoryId: string
): Promise<BackendResponse<MenuResponse[]>> => {
  const isAll = !categoryId || categoryId === 'all';
  const url = isAll 
    ? "/menu/my-menu/get" 
    : `/menu/my-menu/get?categoryId=${categoryId}`;
    
  const res = await api.get(url);
  return res.data;
};

export const onGetRecipeApi = async (
  categoryId: string
): Promise<BackendResponse<RecipeDetailResponse[]>> => {
  const isAll = !categoryId || categoryId === 'all';
  const url = isAll 
    ? "/menu/recipe/get-by-category" 
    : `/menu/recipe/get-by-category?categoryId=${categoryId}`;
    
  const res = await api.get(url);
  return res.data;
};

export const onGetMenuDetailApi = async (
  id: string
): Promise<BackendResponse<MenuResponse>> => {
  const res = await api.get(`/menu/my-menu/get-detail/${id}`);
  return res.data;
};

export const onGetRecipeDetailApi = async (
  id: string
): Promise<BackendResponse<RecipeDetailResponse>> => {
  const res = await api.get(`/menu/recipe/get-detail/${id}`);
  return res.data;
};

export const onSaveRecipeApi = async (
  recipeId: string
): Promise<BackendResponse<RecipeResponse>> => {
  const res = await api.post(`/menu/recipe/save/${recipeId}`);
  return res.data;
};

export const onGetProductDetail = async (id: string)
: Promise<BackendResponse<ProductResponse>> => {
  const data = await api.get(`/product/get-product-detail/${id}`);
  return data.data;
};

export const onTrackView = async (categoryId: string) => {
  const data = await api.post("/user/track-view", {
    categoryId
  })
  return data.data
}

export const onGetProductSpecialByRegion = async (
  params?: GetProductSpecialByRegionParams
): Promise<BackendResponse<ProductResponse[]>> => {
  const res = await api.get("/product/get-by-special", {
    params: {
      region: params?.region,
      sort: params?.sort,
    },
  });

  return res.data;
};