import { useQuery } from "@tanstack/react-query"
import { onGetProductByFilter } from "@/services/api";
const useGetProductByFilter = (sort: string) => {
  const { data, error, isPending, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => {
        return onGetProductByFilter(sort)
    }
  })
  return { data, error, isPending, isError }
};

export default useGetProductByFilter;
