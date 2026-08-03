import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";

export default function useShippingFee() {
  return useQuery({
    queryKey: ["system-setting", "shipping-fee"],
    queryFn: async () => {
      const response = await api.get("/settings/shipping");
      const shippingFee = Number(response.data?.data?.shippingFee);
      if (!Number.isFinite(shippingFee) || shippingFee < 0) {
        throw new Error("Phí vận chuyển từ hệ thống không hợp lệ");
      }
      return shippingFee;
    },
    staleTime: 5 * 60 * 1000,
  });
}
