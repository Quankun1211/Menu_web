import { BackendResponse } from "@/libs/shared/types/backend-response";
import { AddAddressRequest, UpdateAddressRequest, PreviewCheckoutRequest, ApplyCouponRequest, CheckoutRequest } from "../types/api-request";
import { AddAddressResponse, AddressModel, GetAddressesResponse, UpdateAddressResponse, PreviewCheckoutResponse, ApplyCouponResponse, OrderResponse, MyCouponResponse } from "../types/api-response";
import api from "../../../services/axios";

export const onAddAddressApi = async (
    payload: AddAddressRequest
) : Promise<BackendResponse<AddAddressResponse>> => {
    const { data } = await api.post("/address/add", payload);
    return data
}
export const onGetAddressApi = async(): Promise<BackendResponse<GetAddressesResponse>> => {
    const {data} = await api.get("/address/get")
    return data
}
export const onGetCoupon = async (
): Promise<BackendResponse<MyCouponResponse>> => {
  const res = await api.get("/order/my-coupon");
  return res.data;
};
export const onGetAddressDetail = async (
  addressId?: string
): Promise<BackendResponse<AddressModel>> => {
  const { data } = await api.get(`/address/get-detail/${addressId}`);
  return data;
};

export const onUpdateAddressApi = async (
  params: UpdateAddressRequest
): Promise<BackendResponse<UpdateAddressResponse>> => {
  const { addressId, ...body } = params;

  const { data } = await api.put(
    `/address/update/${addressId}`,
    body
  );

  return data;
};
export const previewCheckoutApi = async (
  body: PreviewCheckoutRequest
): Promise<BackendResponse<PreviewCheckoutResponse>> => {
  const { data } = await api.post("/product/checkout/preview", body)
  return data
}

export const applyCouponApi = async (
  payload: ApplyCouponRequest
): Promise<BackendResponse<ApplyCouponResponse>> => {
  const { data } = await api.post("/coupon/apply", payload);
  return data;
};

export const onCheckoutApi = async(
  payload: CheckoutRequest
): Promise<BackendResponse<OrderResponse>> => {
  const { data } = await api.post("/order/create", payload)
  return data
}