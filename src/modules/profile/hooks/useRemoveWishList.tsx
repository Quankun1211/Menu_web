import { useMutation, useQueryClient } from "@tanstack/react-query"
import { onRemoveWishListApi } from "../services/api"

const useRemoveWishList = () => {
    const queryClient = useQueryClient()

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: onRemoveWishListApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-wish-list"] });
        }
    })
    return {mutate, isPending, isError, error}
}
export default useRemoveWishList