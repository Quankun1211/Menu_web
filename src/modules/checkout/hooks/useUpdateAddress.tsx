import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onUpdateAddressApi } from "../services/api";
const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: onUpdateAddressApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-address"],
      });
    },
  });

  return {mutate, isPending, isError, error}
};

export default useUpdateAddress