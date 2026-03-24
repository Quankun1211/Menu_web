import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onCreateMyRecipe } from "../services/api";

const useCreateMyRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationKey: ["create-my-recipe"],
    mutationFn: (formData: FormData) => {
      return onCreateMyRecipe(formData);
    },
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["recipes"] });
        console.log("Recipe created successfully!");
    },
    onError: (error) => {
        console.error("Error creating recipe:", error);
    }
  });

  return { mutate, isPending, error, isError };
};

export default useCreateMyRecipe;