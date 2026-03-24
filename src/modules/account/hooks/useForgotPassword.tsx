import { useMutation } from "@tanstack/react-query"
import { onForgotPasswordApi } from "../services/api"

const useForgotPassword = () => {
    const { data, error, isPending, isError, mutate } = useMutation({
        mutationKey: ["forgot-password"],
        mutationFn: (variables: { email: string }) => {
            return onForgotPasswordApi({ email: variables.email });
        },
    });
    
    return { data, error, isPending, isError, mutate };
};

export default useForgotPassword