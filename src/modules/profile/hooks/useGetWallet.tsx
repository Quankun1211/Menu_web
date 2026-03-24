import { useQuery } from "@tanstack/react-query";
import { onGetWallet } from "../services/api";

const useGetWallet = (isEnabled = true) => {
  return useQuery({
    queryKey: ["get-wallet"],
    queryFn: () => onGetWallet(),
    enabled: isEnabled, 
    retry: false, 
  });
};

export default useGetWallet;