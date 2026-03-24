import { useQuery } from "@tanstack/react-query";
import { onGetProductDetail } from "../services/api";
const useGetProductDetail = (id: string) => {
    const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-product-detail", id],
    queryFn: () =>
      onGetProductDetail(id),
  });

  return { data, isPending, error, isError };
}

export default useGetProductDetail