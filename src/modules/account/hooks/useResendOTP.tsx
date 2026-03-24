import { useMutation } from "@tanstack/react-query"
import { onResendOTPApi } from "../services/api"

const useResendOTP = () => {
    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["resend-otp"],
        mutationFn: (payload: { email: string }) => {
            return onResendOTPApi(payload)
        },
        // onSuccess: (data) => {
        //     if(data) {
        //         router.replace("/(auth)/login")
        //     }
        // }
    })
    return {data, error, isPending, isError, mutate}
}

export default useResendOTP