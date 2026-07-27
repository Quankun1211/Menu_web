import { useQuery } from "@tanstack/react-query";
import { onGetMyOrders } from "../services/api";
const useGetMyOrders = (isLoggedIn: boolean, page = 1, limit = 10, status = "all") => {
    const { data, isPending, isFetching, error, isError } = useQuery({
      queryKey: ["get-my-orders", page, limit, status],
      queryFn: () => onGetMyOrders(page, limit, status),
      enabled: !!isLoggedIn,
      placeholderData: (previousData) => previousData,
    });

    return { data, isPending, isFetching, error, isError };
  };
  
export default useGetMyOrders;
  
