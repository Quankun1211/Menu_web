import { useMutation, useQueryClient } from "@tanstack/react-query"
import { onAddAddressApi } from "../services/api"
const useAddAddress = () => {
    const queryClient = useQueryClient()

    const {mutate, isPending, isError, error} = useMutation({
        mutationFn: onAddAddressApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-address"] });
        }
    })
    return {mutate, isPending, isError, error}
}
export default useAddAddress