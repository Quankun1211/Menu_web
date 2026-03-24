import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onAddToCart } from "../services/api";
import { CartRequest } from "../types/api-request";
const useAddToCart = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (payload: CartRequest) => onAddToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  return { mutate, isPending, error, isError };
};

export default useAddToCart;
