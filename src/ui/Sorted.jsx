import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function Sorted({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currSortBy = searchParams.get("sortBy") || "";

  function handlerChange(e) {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  }

  return (
    <Select
      value={currSortBy}
      options={options}
      type="white"
      onChange={handlerChange}
    />
  );
}

export default Sorted;
