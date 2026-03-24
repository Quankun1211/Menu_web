export type AddAddressRequest = {
    name: string;
    phone: string;
    address: string;
    isDefault?: boolean;
}

export type UpdateAddressRequest = {
    addressId?: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean
}

export type SetDefaultAddressRequest = {
    addressId: string;
}

export type PreviewCheckoutItemRequest = {
    productId: string
    quantity: number
  }
  
export type PreviewCheckoutRequest = {
    items: PreviewCheckoutItemRequest[]
}
export type ApplyCouponRequest = {
    code: string;
    totalAmount: number;
    items: {
      productId: string;
      quantity: number;
    }[];
};

type CheckoutSource = "cart" | "product";

type CheckoutItemRequest = {
  productId: string;
  quantity: number;
};

export type CheckoutRequest = {
  items: CheckoutItemRequest[];
  address: string;
  couponCode?: string;
  source: CheckoutSource;
  paymentMethod: string;
  shippingFee: number,
  platform: "web"
};
