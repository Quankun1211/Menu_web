import { useMutation } from "@tanstack/react-query"
import { onVerifyApi } from "../services/api"

const useVerify = () => {
    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["verify"],
        mutationFn: (payload: { email: string; otp: string, type: string }) => {
            return onVerifyApi(payload)
        },
    })
    return {data, error, isPending, isError, mutate}
}

export default useVerify