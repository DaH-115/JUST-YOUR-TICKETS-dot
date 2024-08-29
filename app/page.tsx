import HomePage from "./home-page";

export interface Movie {
  genre_ids: number[];
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  genres: { id: number; name: string }[];
}

async function getPosts() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&include_adult=true&language=ko-KR`,
    { cache: "force-cache" },
  );
  const posts = await res.json();
  return posts.results;
}

export default async function Page() {
  const recentPosts: Movie[] = await getPosts();

  return <HomePage movieList={recentPosts.slice(0, 10)} />;
}
