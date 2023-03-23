import { AiFillStar, AiOutlineFork } from "react-icons/ai";
import { VscIssues } from "react-icons/vsc";
import { BsCalendarDate } from "react-icons/bs";
import GlobalStore from "@/store/GlobalStore";
import { useSnapshot } from "valtio";

export const GithubSortBy = () => {
  const { sortBy } = useSnapshot(GlobalStore.state);

  return (
    <div className="flex gap-5 items-center">
      <p className="font-bold">Sort by:</p>
      <button
        onClick={() => GlobalStore.setSortBy("stars")}
        className="border border-gray-50 shadow-sm rounded-md px-3 py-1 flex items-center gap-1 group transition-all"
      >
        <p
          className={`group-hover:text-yellow-400 ${
            sortBy === "stars" && "text-yellow-400"
          }`}
        >
          Stars
        </p>
        <AiFillStar
          className={`group-hover:text-yellow-400 ${
            sortBy === "stars" && "text-yellow-400"
          }`}
        />
      </button>
      <button
        onClick={() => GlobalStore.setSortBy("forks")}
        className="border border-gray-50 shadow-sm rounded-md px-3 py-1 flex items-center gap-1 group transition-all"
      >
        <p
          className={`group-hover:text-purple-400 ${
            sortBy === "forks" && "text-purple-400"
          }`}
        >
          Forks
        </p>
        <AiOutlineFork
          className={`group-hover:text-purple-400 ${
            sortBy === "forks" && "text-purple-400"
          }`}
        />
      </button>
      <button
        onClick={() => GlobalStore.setSortBy("issues")}
        className="border border-gray-50 shadow-sm rounded-md px-3 py-1 flex items-center gap-1 group transition-all"
      >
        <p
          className={`group-hover:text-blue-400 ${
            sortBy === "issues" && "text-blue-400"
          }`}
        >
          Issues
        </p>
        <VscIssues
          className={`group-hover:text-blue-400 ${
            sortBy === "issues" && "text-blue-400"
          }`}
        />
      </button>
      <button
        onClick={() => GlobalStore.setSortBy("updated")}
        className="border border-gray-50 shadow-sm rounded-md px-3 py-1 flex items-center gap-1 group transition-all"
      >
        <p
          className={`group-hover:text-green-400 ${
            sortBy === "updated" && "text-green-400"
          }`}
        >
          Update Date
        </p>
        <BsCalendarDate
          className={`group-hover:text-green-400 ${
            sortBy === "updated" && "text-green-400"
          }`}
        />
      </button>
    </div>
  );
};
