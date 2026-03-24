import { useQuery } from "@tanstack/react-query";
import { onGetCategoryMenuApi } from "../services/api";
const useGetCategoryMenu = () => {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["get-category-menu"],
    queryFn: () => {
        return onGetCategoryMenuApi()
    }
  });

  return { data, isPending, error, isError };
}

export default useGetCategoryMenu