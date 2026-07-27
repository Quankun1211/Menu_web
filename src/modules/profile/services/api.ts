import { BackendResponse, PaginatedBackendResponse } from "@/libs/shared/types/backend-response";
import api from "../../../services/axios";
import { MyCouponResponse, MyRecipeDetailResponse, MyRecipeResponse, RemoveFavouriteItemsResponse, WalletResponse, WishListResponse } from "../types/api-response";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { AddToFavouriteRequest, RemoveFavouriteItemsRequest, UpdateMyRecipeRequest } from "../types/api-request";
import { RecipeResponse } from "@/modules/explore/types/api-response";

export const onGetWallet = async (
): Promise<BackendResponse<WalletResponse>> => {
  const res = await api.get("/order/wallet");

  return res.data;
};

export const onConfirm = async (
): Promise<BackendResponse<WalletResponse>> => {
  const res = await api.post("/order/claim-reward");
  return res.data;
};

export const onGetCoupon = async (
): Promise<BackendResponse<MyCouponResponse>> => {
  const res = await api.get("/order/my-coupon");
  return res.data;
};

export const onCreateMyRecipe = async (
  formData: FormData
): Promise<BackendResponse<MyRecipeResponse>> => {
  const res = await api.post("/menu/recipe/create-my-recipes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const onGetMyRecipes = async (
  page = 1,
  limit = 10,
): Promise<PaginatedBackendResponse<MyRecipeResponse[]>> => {
  const res = await api.get("/menu/recipe/get-my-recipes", { params: { page, limit } });
  return res.data;
};

export const onGetMyRecipesDetail = async (
  recipeId: string
): Promise<BackendResponse<MyRecipeDetailResponse>> => {
  const res = await api.get(`/menu/recipe/get-my-recipe-detail/${recipeId}`);
  return res.data;
};

export const onUpdateMyRecipe = async (
  recipeId: string, 
  formData: FormData 
): Promise<BackendResponse<MyRecipeResponse>> => {
  const res = await api.put(`/menu/recipe/update-my-recipe/${recipeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const onDeleteMyRecipe = async (
  recipeId: string
): Promise<BackendResponse<MyRecipeResponse>> => {
  const res = await api.delete(`/menu/recipe/delete-my-recipe/${recipeId}`);
  return res.data;
};

export const onGetMySavedRecipes = async (
  page = 1,
  limit = 10,
): Promise<PaginatedBackendResponse<RecipeResponse[]>> => {
  const res = await api.get("/menu/recipe/saved-list", { params: { page, limit } });
  return res.data;
};

export const onGetWishListApi = async (page = 1, limit = 10): Promise<
  PaginatedBackendResponse<WishListResponse>
> => {
  const { data } = await api.get("/favourite/get-favourite", { params: { page, limit } });
  return data;
};
export const onRemoveWishListApi = async (
  payload: RemoveFavouriteItemsRequest
): Promise<RemoveFavouriteItemsResponse> => {
  const { data } = await api.post("/favourite/remove-favourite", payload);
  return data;
};

export const onAddToFavouriteApi = async (
  payload: AddToFavouriteRequest
) : Promise<BackendResponse<WishListResponse>> => {
  const { data } = await api.post("/favourite/add-to-favourite", payload);
  return data
}
