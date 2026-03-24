import { useQuery } from "@tanstack/react-query"
import { onGetAddressApi } from "../services/api"

const useGetAddress = () => {
    const { data, isPending, error, isError } = useQuery({
        queryKey: ["get-address"],
        queryFn: () => {
            return onGetAddressApi()
        }
    })
    return { data, isPending, error, isError }
}

export default useGetAddress