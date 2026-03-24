import { useQuery } from "@tanstack/react-query"
import { onGetSuggestionProducts } from "../services/api"

const useGetSuggestionProducts = (page = 1, limit = 12) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-suggestion-product", page, limit],
    queryFn: () => onGetSuggestionProducts(page, limit),
    placeholderData: (previousData) => previousData,

  })

  return { 
    data: data, 
    pagination: data?.pagination,
    isPending, 
    error, 
    isError 
  }
}

export default useGetSuggestionProducts