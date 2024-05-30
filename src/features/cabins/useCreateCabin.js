import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { insertCabinRow } from "../../services/apiCabin";

export function useCreateCabin() {
  const queryClient = useQueryClient();
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: (newCabin) => insertCabinRow(newCabin),
    onSuccess: () => {
      toast.success("New cabin created");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: () => toast.error("something is wrong the cabin doesn't created"),
  });

  return { createCabin, isCreating };
}
