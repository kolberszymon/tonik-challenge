import { GithubRepo, GithubRepoFormatted } from "@/types/GithubTypes";
import { proxy } from "valtio";

interface State {
  // fetch results
  repoName: string;
  repos: GithubRepoFormatted[];
  page: number;
  sortBy: "stars" | "forks" | "issues" | "updated";
  totalCount: number;
  numberOfRows: 10 | 20 | 30 | 40 | 50;
}

// Yeah, let's treat it as a global variable, for the sake of showcasing.
const state = proxy<State>({
  repoName: "",
  repos: [],
  page: 1,
  sortBy: "stars",
  totalCount: 0,
  numberOfRows: 10,
});

const GlobalStore = {
  state,

  setRepoName(value: string) {
    state.repoName = value;
  },

  setRepos(value: GithubRepoFormatted[]) {
    state.repos = value;
  },

  setSortBy(value: "stars" | "forks" | "issues" | "updated") {
    state.sortBy = value;
  },

  setTotalCount(value: number) {
    state.totalCount = value;
  },

  setNumberOfRows(value: 10 | 20 | 30 | 40 | 50) {
    state.numberOfRows = value;
  },

  setPage(value: number) {
    state.page = value;
  },

  incrementPage() {
    state.page++;
  },

  decrementPage() {
    state.page--;
  },

  resetPage() {
    state.page = 1;
  },
};

export default GlobalStore;
