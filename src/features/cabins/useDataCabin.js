import { useQuery } from "@tanstack/react-query";
import getCabins from "../../services/apiCabin";

export function useDataCabin() {
  const { isLoading, data: cabins } = useQuery({
    queryFN: getCabins,
    queryKey: ["cabins"],
  });

  return { isLoading, cabins };
}
