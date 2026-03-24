export type CartRequest = {
    productId: string,
    quantity: number
}

export type RemoveCartItemsRequest = {
  productIds: string[];
};
export type UpdateCartQuantityRequest = {
  productId: string;
  quantity: number;
};
