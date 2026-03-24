import { useMutation } from "@tanstack/react-query"
import { onResetPasswordApi } from "../services/api"

const useResetPassword = () => {
    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["reset-password"],
        mutationFn: (variables: { email: string; otp: string; newPassword: string }) => {
            return onResetPasswordApi(variables);
        },
    });
    
    return { data, error, isPending, isError, mutate };
};

export default useResetPassword