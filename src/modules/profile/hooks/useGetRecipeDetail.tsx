import { useQuery } from "@tanstack/react-query";
import { onGetMyRecipesDetail } from "../services/api";

const useGetRecipeDetail = (recipeId: string) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-my-recipe-detail", recipeId],
    queryFn: () => {
        return onGetMyRecipesDetail(recipeId)
    }
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetRecipeDetail;