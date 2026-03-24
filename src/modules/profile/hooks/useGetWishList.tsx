import { useQuery } from "@tanstack/react-query"
import { onGetWishListApi } from "../services/api"

const useGetWishList = () => {
    const { data, isPending, error, isError } = useQuery({
        queryKey: ["get-wish-list"],
        queryFn: () => {
            return onGetWishListApi()
        }
    })
    return { data, isPending, error, isError }
}

export default useGetWishList