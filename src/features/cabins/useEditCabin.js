import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { insertCabinRow } from "../../services/apiCabin";

export function useEditCabin() {
  const queryClient = useQueryClient();

  const { mutate: editCabin, isLoading: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }) => insertCabinRow(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin has been edited");
      queryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: () => toast.error("something is wrong the cabin doesn't created"),
  });

  return { editCabin, isEditing };
}
