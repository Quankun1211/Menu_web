import { useQuery } from "@tanstack/react-query";
import { onGetMenuApi } from "../services/api";

const useGetMenu = (categoryId: string, page = 1, limit = 12) => {
  
  return useQuery({
    queryKey: ["get-menu", categoryId, page, limit],
    queryFn: () => onGetMenuApi(categoryId, page, limit),
    placeholderData: (previousData) => previousData,
  });
};

export default useGetMenu;
