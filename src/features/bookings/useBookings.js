// useQueryClient
import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
// import { PAGE_SIZE } from "../../ui/Pagination";

export function useBookings() {
  // const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const filterValue = searchParams.get("status");

  const filter =
    !filterValue || filterValue === "all"
      ? null
      : {
          field: "status",
          value: filterValue,
        };

  const sortValue = searchParams.get("sortBy") || "startDate-desc";
  const [field, value] = sortValue.split("-");
  const sortBy = { field, value };

  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    data: { data: bookings, count } = {},
    isLoading,
    error,
  } = useQuery({
    queryFn: () => getBookings({ filter, sortBy, page }),
    queryKey: ["bookings", filter, sortBy, page],
  });

  // PreFetching [UX]

  // const pageCount = Math.ceil(count / PAGE_SIZE);
  // if (page < pageCount)
  //   queryClient.prefetchQuery({
  //     queryKey: ["bookings", sortBy, filter, page + 1],
  //     queryFn: () => getBookings({ sortBy, filter, page: page + 1 }),
  //   });
  // if (page > 1)
  //   queryClient.prefetchQuery({
  //     queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
  //     queryKey: ["bookings", filter, sortBy, page - 1],
  //   });

  return { isLoading, bookings, count, error };
}
