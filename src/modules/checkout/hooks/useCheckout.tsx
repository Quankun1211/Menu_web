import { useMutation, useQueryClient } from "@tanstack/react-query"
import { onCheckoutApi } from "../services/api"
import { CheckoutRequest } from "../types/api-request"

const useCheckout = () => {
    const queryClient = useQueryClient()
    const { mutate, isPending, isError } = useMutation({
        mutationKey: ["checkout"],
        mutationFn: (payload: CheckoutRequest) => {
            return onCheckoutApi(payload)
        },
        retry: (failureCount, error: any) =>
            error?.code === "ORDER_CONFLICT_RETRY" && failureCount < 2,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-my-orders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-product-by-region"] 
            })
            queryClient.invalidateQueries({
                queryKey: ["cart"] 
            })
        },
    })
    return { mutate, isPending, isError }
}

export default useCheckout
