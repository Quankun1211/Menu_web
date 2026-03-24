import { useQuery } from "@tanstack/react-query";
import { onGetOrderDetail } from "../services/api";
const useGetOrderDetail = (orderId?: string) => {
    const { data, isPending, error, isError, isFetching, refetch } = useQuery({
      queryKey: ["get-my-orders-detail", orderId],
      queryFn:() => onGetOrderDetail(orderId),
      enabled: !!orderId,
      staleTime: 30 * 1000,
    });
  
    return { data, isPending, error, isError, isFetching, refetch };
  };
  
export default useGetOrderDetail;
  