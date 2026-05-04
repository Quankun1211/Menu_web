import { useNavigate } from "react-router"
import { useAppStore } from "../../../store/app.store"
import { useMutation } from "@tanstack/react-query"
import { onLogInApi } from "../services/api"
import { jwtDecode } from "jwt-decode"
import type { JwtPayload } from "../../../libs/shared/types/jwt-payload"
import { setToken } from "../../../utils/token"

const useLogin = () => {
    const navigate = useNavigate()
    const {setUserData} = useAppStore()

    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["login"],
        mutationFn: onLogInApi,
        onSuccess: (data) => {
            console.log(data);
            
            if (data && data.data) {
                const { access_token } = data.data;
                const userData = jwtDecode(access_token) as JwtPayload;
                setToken(access_token);
                setUserData(userData);
                navigate("/");
            }

        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useLogin