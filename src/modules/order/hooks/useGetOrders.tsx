import { useQuery } from "@tanstack/react-query";
import { onGetMyOrders } from "../services/api";
const useGetMyOrders = (isLoggedIn: boolean) => {
    const { data, isPending, error, isError } = useQuery({
      queryKey: ["get-my-orders"],
      queryFn: onGetMyOrders,
      enabled: !!isLoggedIn
    });
  
    return { data, isPending, error, isError };
  };
  
export default useGetMyOrders;
  