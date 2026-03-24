import { useQuery } from "@tanstack/react-query";
import { onGetProductByRegion } from "../services/api";

type UseGetProductByRegionProps = {
  region: string;
  categoryId?: string;
  sort?: string;
  page?: number; 
  limit?: number; 
};

const useGetProductByRegion = ({
  region,
  categoryId,
  sort,
  page = 1,
  limit = 10,
}: UseGetProductByRegionProps) => {
  return useQuery({
    queryKey: ["get-product-by-region", region, categoryId, sort, page, limit],
    queryFn: () =>
      onGetProductByRegion({
        region,
        categoryId,
        sort,
        page,
        limit,
      }),
    enabled: Boolean(region),
    placeholderData: (previousData) => previousData,
  });
};
export default useGetProductByRegion;