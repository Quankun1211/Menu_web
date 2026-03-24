import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { onSaveRecipeApi } from '../services/api';

const useSaveRecipe = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError  } = useMutation({
    mutationKey: ["save-recipe"], 
    mutationFn: (recipeId: string) => onSaveRecipeApi(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["get-recipe-by-category"]})
      queryClient.invalidateQueries({queryKey: ["get-saved-recipe"]})
    }
  });

  return { mutate, isPending, error, isError };
}

export default useSaveRecipe