import { useQuery } from "@tanstack/react-query";
import { onGetSpecialDetail } from "../services/api";

const useGetSpecialDetail = (id?: string) => {
  return useQuery({
    queryKey: ["get-special-detail", id],
    queryFn: () => onGetSpecialDetail(id as string),
    enabled: Boolean(id),
  });
};

export default useGetSpecialDetail;
