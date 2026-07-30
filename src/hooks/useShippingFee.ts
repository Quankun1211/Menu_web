import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";

export default function useShippingFee() {
  return useQuery({
    queryKey: ["system-setting", "shipping-fee"],
    queryFn: async () => {
      const response = await api.get("/settings/shipping");
      return Number(response.data?.data?.shippingFee ?? 25000);
    },
    staleTime: 5 * 60 * 1000,
  });
}
