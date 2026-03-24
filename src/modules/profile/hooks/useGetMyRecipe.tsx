import { useQuery } from "@tanstack/react-query";
import { onGetMyRecipes } from "../services/api";

const useGetMyRecipe = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-my-recipes"],
    queryFn: () => {
        return onGetMyRecipes()
    }
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetMyRecipe;