import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onDeleteAddressApi, onSetDefaultAddressApi } from "../services/api";

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onDeleteAddressApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["get-address"] }),
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onSetDefaultAddressApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["get-address"] }),
  });
};
