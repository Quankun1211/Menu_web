import { useQuery } from "@tanstack/react-query";
import { onGetProductSpecialByRegion } from "../services/api";

type UseGetProductSpecialByRegionProps = {
  region: string;
  sort?: string;
  page?: number;
  limit?: number;
};

const useGetProductSpecial = ({
  region,
  sort,
  page = 1,
  limit = 12,
}: UseGetProductSpecialByRegionProps) => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["get-product-by-special", region, sort, page, limit],
    queryFn: () =>
      onGetProductSpecialByRegion({
        region,
        sort,
        page,
        limit,
      }),
    enabled: Boolean(region),
    placeholderData: (previousData) => previousData,
  });

  return { data, isPending, isFetching, error, isError, refetch };
};

export default useGetProductSpecial;
