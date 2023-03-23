export type GithubResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepo[];
};

export type GithubRepo = {
  id: number;
  stargazers_count: number;
  name: string;
  created_at: string;
  owner: GithubOwner;
  html_url: string;
  full_name: string;
};

export type GithubRepoFormatted = {
  id: number;
  stars: number;
  name: string;
  created_at: string;
  owner: string;
  html_url: string;
};

export type GithubOwner = {
  login: string;
  id: number;
};
