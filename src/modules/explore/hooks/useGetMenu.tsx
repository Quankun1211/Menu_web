import { useQuery } from "@tanstack/react-query";
import { onGetMenuApi } from "../services/api";

const useGetMenu = (categoryId: string) => {
  
  return useQuery({
    queryKey: ["get-menu", categoryId],
    queryFn: () => onGetMenuApi(categoryId),
    placeholderData: (previousData) => previousData,
  });
};

export default useGetMenu;