import { AddressModel } from "@/modules/checkout/types/api-response";
export type OrderStatus = "pending" | "assigned" | "confirmed" | "processing" | "shipping" | "delivered" | "completed" | "pending_cancel" | "payment_failed" | "cancelled" | "refunded";
export type OrderPaymentStatus = "pending" | "checking" | "paid" | "failed" | "cancelled" | "refunded";
export type OrderResponse = {
  _id: string;
  userId: string;
  subTotal: number;
  couponCode: string | null;
  couponDiscount: number;
  totalPrice: number;
  itemsForRebuy: OrderProductResponse[],
  status: OrderStatus;
  createdAt: string;
  cancelReason: string; 
  cancelledAt: string;
  cancelledBy: string;
  address: AddressModel;
  productSummary: string;
  thumbnail: string;
  updatedAt: string;
  paymentUrl?: string;
  paymentStatus: OrderPaymentStatus;
  paymentMethod: string;
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

export type OrderProductResponse = {
  productId: string;
  name: string;
  image: string;
  unit: string;
  price: number;
  quantity: number;
  total: number
}

export type OrderDetailResponse = {
  _id: string,
  orderId: string,
  status: OrderStatus,
  address: AddressModel,
  items: OrderProductResponse[],
  subTotal: number,
  couponDiscount: number,
  totalPrice: number,
  createdAt: string,
  paymentStatus: OrderPaymentStatus;
  paidAt: Date;
  paymentMethod: string;
  paymentExpiresAt?: string;
  lastKnownLocation: {
    latitude: number,
    longitude: number
  },
  deliveredAt: Date
}
  
