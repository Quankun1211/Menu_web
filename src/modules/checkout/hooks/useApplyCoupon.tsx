// hooks/useApplyCoupon.ts
import { useMutation } from "@tanstack/react-query";
import { applyCouponApi } from "../services/api";
import { ApplyCouponRequest } from "../types/api-request";
export const useApplyCoupon = () => {
  return useMutation({
    mutationKey: ["apply-coupon"],
    mutationFn: (payload: ApplyCouponRequest) => applyCouponApi(payload),
  });
};
