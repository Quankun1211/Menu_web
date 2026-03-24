import { useQuery } from '@tanstack/react-query'
import { onGetMeApi } from '../services/api'

const useGetMe = (enabled: boolean = true) => {
    const { data, error, isPending, isError, refetch, isFetched } = useQuery({
        queryKey: ["me"],
        queryFn: onGetMeApi,
        enabled,
        retry: 0,
        staleTime: 5 * 60 * 1000
    }) 
    
    return { data, error, isError, isPending, refetch, isFetched }
}

export default useGetMe