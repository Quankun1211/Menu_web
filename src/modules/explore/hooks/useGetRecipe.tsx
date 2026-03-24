import { useQuery } from "@tanstack/react-query";
import { onGetRecipeApi } from "../services/api";

const useGetRecipe = (categoryId: string) => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-recipe-by-category"],
    queryFn: () => onGetRecipeApi(categoryId)
  })
  return { data, isPending, error, isError };
};

export default useGetRecipe;