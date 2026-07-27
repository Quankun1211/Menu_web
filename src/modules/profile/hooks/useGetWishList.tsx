import { useQuery } from "@tanstack/react-query"
import { onGetWishListApi } from "../services/api"

const useGetWishList = (page = 1, limit = 10) => {
    const { data, isPending, isFetching, error, isError } = useQuery({
        queryKey: ["get-wish-list", page, limit],
        queryFn: () => {
            return onGetWishListApi(page, limit)
        },
        placeholderData: (previousData) => previousData,
    })
    return { data, isPending, isFetching, error, isError }
}

export default useGetWishList
