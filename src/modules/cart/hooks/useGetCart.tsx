import { useQuery } from "@tanstack/react-query";
import { onGetCart } from "../services/api";

const useGetCart = (isLoggedIn: boolean) => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: onGetCart,
    enabled: isLoggedIn,
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCart;