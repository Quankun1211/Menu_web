import { create } from "zustand";
import { AddressModel } from "@/modules/checkout/types/api-response";

export type CheckoutSource = "cart" | "buy_now" | "direct" | "menu" | "recipe"; 

type CheckoutItem = {
  productId: string;
  quantity: number;
};

type CheckoutStore = {
  selectedAddress: AddressModel | null;
  checkoutItems: CheckoutItem[];
  source: CheckoutSource; 
  setSelectedAddress: (address: AddressModel | null) => void;
  setCheckoutData: (items: CheckoutItem[], source: CheckoutSource) => void;
  clearCheckout: () => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedAddress: null,
  checkoutItems: [],
  source: "cart", 
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setCheckoutData: (items, source) => set({ checkoutItems: items, source }),
  clearCheckout: () => set({ selectedAddress: null, checkoutItems: [], source: "cart" }),
}));