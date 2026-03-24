export type UpdateMyRecipeRequest = FormData
export type RemoveFavouriteItemsRequest = {
  productIds: string[];
};
export type AddToFavouriteRequest = {
  productId: string
}