import { useQuery } from "@tanstack/react-query";
import { onSearchProducts } from "../services/api";
const useSearchProducts = (keyword: string, sort?: string) => {
  return useQuery({
    queryKey: ['search-products', keyword, sort],
    queryFn: () => onSearchProducts(keyword, sort),
    enabled: !!keyword && keyword.trim().length > 0,
    staleTime: 0, 
    gcTime: 0,
  });
};

export default useSearchProducts;