import { useQuery } from "@tanstack/react-query";
import { onGetRecipeLastest } from "../services/api";
const useGetLastestRecipe = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-recipe-lastest"],
    queryFn: () => {
        return onGetRecipeLastest()
    }
  });

  return { data, isPending, error, isError };
};

export default useGetLastestRecipe;
