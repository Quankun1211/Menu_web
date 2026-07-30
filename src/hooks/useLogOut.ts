import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "../store/app.store"
import { onLogoutApi } from "../services/api"
import { removeRefreshToken, removeToken } from "../utils/token"

const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { setUserData } = useAppStore();

    const { mutate, isPending } = useMutation({
        mutationKey: ["logout"],
        mutationFn: onLogoutApi,
        onSettled: () => {
            removeToken();
            removeRefreshToken();
            setUserData(null);

            navigate("/", { replace: true });

            setTimeout(() => {
                queryClient.clear();
            }, 0);
        }
    });

    return { mutate, isPending };
};

export default useLogout
