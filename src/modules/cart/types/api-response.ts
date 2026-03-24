import { ProductResponse } from "@/modules/explore/types/api-response";
type Sale = {
  percent: number
}
export type CartItemResponse = {
  _id: string;
  productId: string;
  product: ProductResponse;
  finalPrice: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  itemTotal: number
  sale: Sale
};

export type CartDataResponse = {
  items: CartItemResponse[];
  totalAmount: number;
};
export type CartResponse = {
  code: number;
  data: CartDataResponse;
};
export type RemoveCartItemsResponse = {
  code: number;
  message: string;
};
