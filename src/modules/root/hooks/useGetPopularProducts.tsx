import { useQuery } from "@tanstack/react-query";
import { ongetPopularProducts } from "../services/api";
const useGetPopularProducts = (limit?: number) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-popular-products", limit],
    queryFn: () => {
        return ongetPopularProducts(limit)
    }
  });

  return { data, isPending, error, isError };
};

export default useGetPopularProducts;
