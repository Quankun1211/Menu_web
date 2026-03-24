import { useQuery } from "@tanstack/react-query";
import { onGetMySavedRecipes } from "../services/api";

const useGetSavedRecipe = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-saved-recipe"],
    queryFn: () => {
        return onGetMySavedRecipes()
    }
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetSavedRecipe;