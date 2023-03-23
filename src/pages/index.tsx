import { useEffect, useState } from "react";
import GlobalStore from "@/store/GlobalStore";
import { useSnapshot } from "valtio";
import { useDebounce } from "use-debounce";
import Loader from "@/components/Loader";
import { GithubRepo, GithubRepoFormatted } from "@/types/GithubTypes";
import ReposTable from "@/components/ReposTable";
import moment from "moment";
import Input from "@/components/Input";
import { useRouter } from "next/router";
import { GithubSortBy } from "@/components/GithubSortBy";
import { useQuery } from "@tanstack/react-query";
import { SelectNumberOfRows } from "@/components/SelectNumberOfRows";

export default function Home() {
  const [query, setQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { repoName, repos, page, sortBy, numberOfRows } = useSnapshot(
    GlobalStore.state
  );

  // It waits for user to actually stop typing for 1 second before updating the state
  const [repoNameToFetch] = useDebounce(repoName, 1000);
  const router = useRouter();

  const fetchReposFromGithub = async () => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${repoName}&sort=${sortBy}&order=desc&page=${page}&per_page=${numberOfRows}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
        },
      }
    );

    if (response.status === 403) {
      setErrorMessage("Github API rate limit exceeded");
      throw new Error();
    }

    const data = await response.json();

    GlobalStore.setTotalCount(data["total_count"]);

    const formattedRepos: GithubRepoFormatted[] = data.items.map(
      (item: GithubRepo) => {
        return {
          id: item.id,
          stars: item.stargazers_count,
          name: item.full_name,
          created_at: moment(item.created_at).format("YYYY-MM-DD"),
          owner: item.owner.login,
          html_url: item.html_url,
        };
      }
    );

    return formattedRepos;
  };

  const formatFetchedRepos = (data: GithubRepoFormatted[]) => {
    if (data.length === 0) {
      GlobalStore.setRepos([]);

      return false;
    }

    if (page === 1) {
      GlobalStore.setRepos(data);
    } else {
      GlobalStore.setRepos([...repos, ...data]);
    }
  };

  const reposQuery = useQuery({
    queryKey: ["repos", { repoNameToFetch, page, sortBy, numberOfRows }],
    queryFn: fetchReposFromGithub,
    enabled: !!repoNameToFetch,
    onSuccess: (data) => {
      formatFetchedRepos(data);
    },
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (router.isReady) {
      const { repoName, page, sort, rows } = router.query;

      GlobalStore.setRepoName(repoName as string);
      GlobalStore.setPage(parseInt(page as string));
      GlobalStore.setSortBy(sort as "stars" | "forks" | "issues" | "updated");
      GlobalStore.setNumberOfRows(
        parseInt(rows as string) as 10 | 20 | 30 | 40 | 50
      );

      setHasMounted(true);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!repoName) {
      return;
    }
    GlobalStore.resetPage();
    GlobalStore.setRepoName(repoName);
  }, [repoNameToFetch]);

  useEffect(() => {
    if (!repoName && page === 1 && hasMounted) {
      router.push(`?`, undefined, { shallow: true });
      return;
    }

    setQuery(
      `?repoName=${repoName}&page=${page}&sort=${sortBy}&rows=${numberOfRows}`
    );
  }, [repoNameToFetch, page, sortBy, numberOfRows]);

  useEffect(() => {
    if (!repoNameToFetch) {
      return;
    }

    router.push(`${query}`, undefined, { shallow: true });
  }, [query]);

  return (
    <main className="w-full h-screen flex items-center justify-center flex-col gap-4 p-5">
      <h1 className="text-xl">Find the repo that you&apos;re looking for</h1>
      <div className="flex  items-center justify-center gap-3 w-1/2">
        <div className="flex flex-col items-center justify-center w-full">
          <Input
            placeholder="Type in the repo name..."
            value={repoName}
            onChange={(e) => {
              GlobalStore.setRepoName(e.target.value);
            }}
            id="repo-name"
          />
          {reposQuery.isError && ( // This is the error message
            <span className="text-red-500 text-xs">
              {errorMessage || "Something went wrong"}
            </span>
          )}
        </div>
        {reposQuery.isFetching && <Loader />}
      </div>
      <GithubSortBy />
      <SelectNumberOfRows />
      <div className="w-full h-[50px]">
        <ReposTable pageSize={numberOfRows} data={reposQuery.data || []} />
      </div>
    </main>
  );
}
