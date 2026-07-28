import { useNavigate } from "react-router"
import { useAppStore } from "../../../store/app.store"
import { useMutation } from "@tanstack/react-query"
import { onLogInApi } from "../services/api"
import { setRefreshToken, setToken } from "../../../utils/token"

const useLogin = () => {
    const navigate = useNavigate()
    const {setUserData} = useAppStore()

    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["login"],
        mutationFn: onLogInApi,
        onSuccess: (data) => {
            console.log(data);
            
            if (data && data.data) {
                setToken(data.data.access_token);
                setRefreshToken(data.data.refresh_token);
                setUserData(data.data);
                navigate("/");
            }

        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useLogin
