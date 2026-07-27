import { useQuery } from "@tanstack/react-query";
import { onGetMyRecipes } from "../services/api";

const useGetMyRecipe = (page = 1, limit = 10) => {
  const { data, isPending, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["get-my-recipes", page, limit],
    queryFn: () => {
        return onGetMyRecipes(page, limit)
    },
    placeholderData: (previousData) => previousData,
  });

  return { data, isPending, isFetching, error, isError, refetch };
};

export default useGetMyRecipe;
