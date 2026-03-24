import { useQuery } from "@tanstack/react-query";
import { onGetRecipeDetailApi } from "../services/api";
const useGetRecipeDetail = (id: string) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-recipe-detail", id], 
    queryFn: () => onGetRecipeDetailApi(id),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetRecipeDetail;