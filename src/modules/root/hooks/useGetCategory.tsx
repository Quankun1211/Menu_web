import { useQuery } from "@tanstack/react-query";
import { onGetCategoriesApi } from "../services/api";

const useGetCategory = (limit?: number) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-categories", limit],
    queryFn: () => {
        return onGetCategoriesApi(limit)
    }
  });

  return { data, isPending, error, isError };
};

export default useGetCategory;
