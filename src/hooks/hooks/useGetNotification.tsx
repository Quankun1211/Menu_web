import { useQuery } from "@tanstack/react-query"
import { onGetNotification } from "@/services/api";
const useGetNotification = () => {
  const { data, error, isPending, isError, isFetching } = useQuery({
    queryKey: ['get-notification'],
    queryFn: () => {
        return onGetNotification()
    }
  })
  return { data, error, isPending, isError, isFetching}
};

export default useGetNotification;
