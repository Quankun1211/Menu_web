import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onUpdateMyRecipe } from "../services/api";
import { UpdateMyRecipeRequest } from "../types/api-request";

const useUpdateMyRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationKey: ["update-my-recipe"],
    mutationFn: (params: { recipeId: string; formData: UpdateMyRecipeRequest }) => {
      return onUpdateMyRecipe(params.recipeId, params.formData);
    },
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
        console.error("Error creating recipe:", error);
    }
  });

  return { mutate, isPending, error, isError };
};

export default useUpdateMyRecipe;