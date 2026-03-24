import { useQuery } from "@tanstack/react-query";
import { onGetMenuDetailApi } from "../services/api";
const useGetMenuDetail = (id: string) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["get-menu-detail", id], 
    queryFn: () => onGetMenuDetailApi(id),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetMenuDetail;