import { useQuery } from "@tanstack/react-query"
import { previewCheckoutApi } from "../services/api"
export const usePreviewCheckout = (
    items: { productId: string; quantity: number }[]
  ) => {
    return useQuery({
      queryKey: ["preview-checkout", items],
      queryFn: () => previewCheckoutApi({ items }),
      enabled: items.length > 0,   
    })
  }
  