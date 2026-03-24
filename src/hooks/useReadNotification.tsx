import { useMutation } from "@tanstack/react-query"
import { onReadNotification } from "../services/api"
import { useQueryClient } from "@tanstack/react-query"

const useReadNotification = () => {
    const queryClient = useQueryClient()
    const {data, error, isPending, isError, mutate} = useMutation({
        mutationKey: ["read-notification"],
        mutationFn: onReadNotification,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-notification"] });

        }
    })
    return {data, error, isPending, isError, mutate}
}

export default useReadNotification