import { useQuery } from "@tanstack/react-query";
import { onGetMySavedRecipes } from "../services/api";

const useGetSavedRecipe = (page = 1, limit = 10) => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["get-saved-recipe", page, limit],
    queryFn: () => {
        return onGetMySavedRecipes(page, limit)
    },
    placeholderData: (previousData) => previousData,
  });

  return { data, isPending, isFetching, error, isError, refetch };
};

export default useGetSavedRecipe;
