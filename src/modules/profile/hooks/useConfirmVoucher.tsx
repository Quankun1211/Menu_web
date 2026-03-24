import { useMutation } from "@tanstack/react-query";
import { onConfirm } from "../services/api";

const useConfirmVoucher = () => {
  const { mutate, isPending, error, isError } = useMutation({
    mutationKey: ["confirm-voucher"],
    mutationFn: () => {
        return onConfirm()
    }
  });

  return { mutate, isPending, error, isError };
};

export default useConfirmVoucher;