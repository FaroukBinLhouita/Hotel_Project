import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import { useDataCabin } from "./useDataCabin";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";

function CabinTable() {
  const { isLoading, cabins } = useDataCabin();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  // FILTER
  const filterValue = searchParams.get("discount") || "all";
  let filterData;

  if (filterValue === "all") filterData = cabins;

  if (filterValue === "no-discount")
    filterData = cabins.filter((cabin) => cabin.discount === 0);

  if (filterValue === "with-discount")
    filterData = cabins.filter((cabin) => cabin.discount > 0);

  // SORT
  const currSortBy = searchParams.get("sortBy") || "startDate-asc";
  const [field, direction] = currSortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedData = filterData.sort(
    (a, b) => (a[field] - b[field]) * modifier
  );

  return (
    <Menus>
      <Table cols="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr" role="table">
        <Table.Header role="row">
          <div></div>
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={sortedData}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />}
        />
      </Table>
    </Menus>
  );
}

export default CabinTable;
