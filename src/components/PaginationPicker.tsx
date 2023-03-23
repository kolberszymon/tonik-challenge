import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import { useSnapshot } from "valtio";
import GlobalStore from "@/store/GlobalStore";

interface PaginationPicker {
  setPage: any;
}

const PaginationPicker: React.FC<PaginationPicker> = ({ setPage }) => {
  const { page, totalCount } = useSnapshot(GlobalStore.state);

  const isRightArrowDisabled = () => {
    if (Math.ceil(totalCount / 10) === page) return true;
    return false;
  };

  return (
    <div className="flex w-full justify-center gap-4 items-center relative py-5">
      <button
        onClick={() => setPage("minus")}
        className={`${page === 1 ? "cursor-auto" : "cursor-pointer"}`}
      >
        <BsFillArrowLeftCircleFill fill={page === 1 ? "#4A5568" : "#4e46e5"} />
      </button>
      <div className="text-gray-700 text-sm">{page}</div>

      <button onClick={() => setPage("plus")} disabled={isRightArrowDisabled()}>
        <BsFillArrowRightCircleFill
          fill={isRightArrowDisabled() ? "#4A5568" : "#4e46e5"}
        />
      </button>
    </div>
  );
};

export default PaginationPicker;
