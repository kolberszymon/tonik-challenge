import GlobalStore from "@/store/GlobalStore";
import { useSnapshot } from "valtio";

export const SelectNumberOfRows = () => {
  const { numberOfRows } = useSnapshot(GlobalStore.state);

  return (
    <div className="flex">
      <p>Number of rows:</p>
      <select
        className="ml-2 border border-gray-50 shadow-sm rounded-md px-3 py-1"
        value={numberOfRows}
        onChange={(e) =>
          GlobalStore.setNumberOfRows(
            parseInt(e.target.value) as 10 | 20 | 30 | 40 | 50
          )
        }
      >
        {[10, 20, 30, 40, 50].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
