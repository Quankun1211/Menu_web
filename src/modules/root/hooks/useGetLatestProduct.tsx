import { useQuery } from "@tanstack/react-query";
import { onGetSpecialLatestProduct } from "../services/api";

const useGetLatestProduct = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-popular-products"],
    queryFn: () => {
        return onGetSpecialLatestProduct()
    }
  });

  return { data, isPending, error, isError };
};

export default useGetLatestProduct;
