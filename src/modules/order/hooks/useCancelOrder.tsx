import { useMutation, useQueryClient } from "@tanstack/react-query"
import { onCancelOrder } from "../services/api"
import { CancelOrderRequest } from "../types/api-request"

const useCancelOrder = () => {
    const queryClient = useQueryClient()
    const { mutate, isPending, isError } = useMutation({
        mutationKey: ["cancel-order"],
        mutationFn: (payload: CancelOrderRequest) => {
            return onCancelOrder(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-my-orders"],
            });
            queryClient.invalidateQueries({
                queryKey: ["get-my-orders-detail"]
            })
        },
    })
    return {mutate, isPending, isError}
}

export default useCancelOrder