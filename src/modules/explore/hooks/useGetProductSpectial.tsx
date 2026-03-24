import { useQuery } from "@tanstack/react-query";
import { onGetProductSpecialByRegion } from "../services/api";

type UseGetProductSpecialByRegionProps = {
  region: string;
  sort?: string;
};

const useGetProductSpecial = ({
  region,
  sort,
}: UseGetProductSpecialByRegionProps) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-product-by-special", region, sort],
    queryFn: () =>
      onGetProductSpecialByRegion({
        region,
        sort,
      }),
    enabled: Boolean(region),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetProductSpecial;