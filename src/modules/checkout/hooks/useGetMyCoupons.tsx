import { useQuery } from "@tanstack/react-query";
import { onGetCoupon } from "../services/api";

const useGetMyCoupons = (isEnabled = true) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-coupon"],
    queryFn: () => {
        return onGetCoupon()
    },
    enabled: isEnabled, 
    retry: false, 
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetMyCoupons;