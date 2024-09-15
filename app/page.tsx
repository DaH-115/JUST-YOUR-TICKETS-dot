import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import HomePage from "app/home-page";

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
  runtime: string;
  production_companies: { id: number; name: string }[];
  backdrop_path?: string;
}

async function getPosts() {
  const nowPlayingMovies = fetchNowPlayingMovies();
  return nowPlayingMovies;
}

export default async function Page() {
  const nowPlayingMovies: Movie[] = await getPosts();
  return <HomePage movieList={nowPlayingMovies.slice(0, 10)} />;
}
