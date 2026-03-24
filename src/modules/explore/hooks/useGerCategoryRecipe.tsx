import { useQuery } from "@tanstack/react-query";
import { onGetCategoryRecipeApi } from "../services/api";
const useGetCategoryRecipe = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-category-recipe"],
    queryFn: () => {
        return onGetCategoryRecipeApi()
    }
  });

  return { data, isPending, error, isError };
}

export default useGetCategoryRecipe