import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onRemoveCartItems } from "../services/api";
const useRemoveCartItems = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: onRemoveCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { removeCartItems: mutate, isPending, isError, error };
};

export default useRemoveCartItems;
