import { useQuery } from "@tanstack/react-query"
import { onGetShockDealProducts } from "../services/api"

const useGetShockDeals = (page: number = 1, limit: number = 12) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-shock-deals", page, limit],
    queryFn: () => onGetShockDealProducts(page, limit),
  });

  return { 
    data,
    isPending, 
    error, 
    isError 
  };
};

export default useGetShockDeals