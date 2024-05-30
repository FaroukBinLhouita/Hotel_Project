import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isLoading } = useMutation({
    mutationFn: ({ fullName, password, email }) =>
      signupApi({ fullName, password, email }),

    onSuccess: () =>
      toast.success("we have send a message to your email please confirm it"),
  });

  return { signup, isLoading };
}
