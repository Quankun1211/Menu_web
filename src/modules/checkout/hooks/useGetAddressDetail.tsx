import { useQuery } from "@tanstack/react-query"
import { onGetAddressDetail } from "../services/api"

const useGetAddressDetail = (addressId?: string) => {
  return useQuery({
    queryKey: ["get-address", addressId],
    queryFn: () => onGetAddressDetail(addressId),
    enabled: !!addressId,
  });
};

export default useGetAddressDetail