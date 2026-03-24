import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onLogoutApi } from "../services/api";
import { useAuthStore } from "../store/auth.store"; 
import { removeRefreshToken } from "../utils/token";

const useLogout = () => {
    const queryClient = useQueryClient();
    const { logout } = useAuthStore();

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: onLogoutApi,
        onSuccess: async () => {
            await logout();
            await removeRefreshToken();
            queryClient.clear();
        },
        onError: (err) => {
            console.error(err);
        }
    });
};

export default useLogout;