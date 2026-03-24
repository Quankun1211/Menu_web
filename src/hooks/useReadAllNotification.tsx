import { useMutation } from "@tanstack/react-query"
import { onReadAllNotification } from "../services/api"
import { useQueryClient } from "@tanstack/react-query"

const useReadAllNotification = () => {
    const queryClient = useQueryClient()
    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["read-all-notification"],
        mutationFn: onReadAllNotification,
        onSuccess: () => {
            console.log("Success");
            
            queryClient.invalidateQueries({ queryKey: ["get-notification"] });

        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useReadAllNotification