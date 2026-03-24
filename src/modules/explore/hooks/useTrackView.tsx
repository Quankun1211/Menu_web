import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onTrackView } from "../services/api";
const useTrackView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => onTrackView(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-suggestion-product"],
      });
    },
  });
};

export default useTrackView