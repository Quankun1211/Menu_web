import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onUpdateCartQuantity } from "../services/api";
const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: onUpdateCartQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
  return { mutate, isPending, error, isError };
};

export default useUpdateCartQuantity;
