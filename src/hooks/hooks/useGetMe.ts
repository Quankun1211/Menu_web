import { useQuery } from "@tanstack/react-query"
import { onGetMeApi } from "../services/api";
import { useAuthStore } from "@/store/auth.store";
const useGetMe = () => {
  const { token } = useAuthStore()
  const { data, error, isPending, isError, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: onGetMeApi,
    enabled: !!token,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  })
  return { data, error, isPending, isError, refetch }
};

export default useGetMe;
