export type AddressModel = {
    _id: string;
    userId: string;
    name: string;
    phone: string;
    address: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
export type AddAddressResponse = {
  message: string;
  data: AddressModel;
}
type PrivateCoupon = {
    code: string,
    type: string,
    value: number,
    startDate: string,
    endDate: string,
    isPrivate: boolean,
    allowedUsers: string[]
}
export type MyCouponResponse = {
    couponId: PrivateCoupon,
    acquiredAt: Date
}[]
export type GetAddressesResponse = AddressModel[];


export type UpdateAddressResponse = {
  message: string;
  data: AddressModel;
}

export type SetDefaultAddressResponse = {
  message: string;
}

export type CheckoutSource = "cart" | "buy_now";

export type CheckoutItem = {
  productId: string;
  quantity: number;
};

export type CheckoutParams = {
  source: CheckoutSource;
  items: CheckoutItem[];
};

export type CheckoutItemResponse = {
  productId: string
  name: string
  price: number
  sale: {
    percent: number
    startDate: string
    endDate: string
  } | null
  finalPrice: number
  quantity: number
  total: number
}

export type PreviewCheckoutResponse = {
  items: CheckoutItemResponse[]
  totalAmount: number
}

export type AppliedCoupon = {
  code: string;
  discountAmount: number;
};

export type ApplyCouponResponse = {
  code: string;
  discountAmount: number;
  finalAmount: number;
};
export type OrderProductResponse = {
  productId: string;
  name: string;
  image: string;
  unit: string;
  price: number;
  quantity: number;
  total: number
}
export type OrderResponse = {
  _id: string;
  userId: string;
  subTotal: number;
  couponCode: string | null;
  couponDiscount: number;
  totalPrice: number;
  itemsForRebuy: OrderProductResponse[],
  status:
    | "pending"
    | "confirmed"
    | "delivered"
    | "cancelled"
    | "shipping"
    | "assigned"
    | "completed"
    | "pending_cancel";
  createdAt: string;
  cancelReason: string; 
  cancelledAt: string;
  cancelledBy: string;
  address: AddressModel;
  productSummary: string;
  thumbnail: string;
  updatedAt: string;
  paymentUrl?: string;
  paymentStatus: string;
  shipperId?: string;
  shippedAt: string,
  deliveredAt: string,
  cancelRequest?: {
    reason: string;
    requestedAt: string;
    adminNote?: string;
    isAccepted: boolean;
  };
  customer: {
    _id: string,
    name: string
  }
};