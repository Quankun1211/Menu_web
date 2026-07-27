import { useQuery } from "@tanstack/react-query";
import { onGetRecipeApi } from "../services/api";

const useGetRecipe = (categoryId: string, page = 1, limit = 12) => {
  const { data, isPending, isFetching, error, isError } = useQuery({
    queryKey: ["get-recipe-by-category", categoryId, page, limit],
    queryFn: () => onGetRecipeApi(categoryId, page, limit),
    placeholderData: (previousData) => previousData,
  })
  return { data, isPending, isFetching, error, isError };
};

export default useGetRecipe;
