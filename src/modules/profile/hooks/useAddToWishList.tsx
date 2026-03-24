import { useMutation, useQueryClient } from "@tanstack/react-query"
import { onAddToFavouriteApi } from "../services/api"
const useAddToWishList = () => {
    const queryClient = useQueryClient()

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: onAddToFavouriteApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-wish-list"] });
        }
    })
    return {mutate, isPending, isError, error}
}
export default useAddToWishList