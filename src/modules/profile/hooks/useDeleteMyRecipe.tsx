import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onDeleteMyRecipe } from "../services/api";

const useDeleteMyRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationKey: ["delete-my-recipe"],
    mutationFn: (recipeId: string) => {
      return onDeleteMyRecipe(recipeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-my-recipes"] });
    },
    onError: (error) => {
        console.error("Error deleting recipe:", error);
    }
  });

  return { mutate, isPending, error, isError };
};

export default useDeleteMyRecipe;