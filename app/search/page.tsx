import { Metadata } from "next";
import SearchPage from "app/search/components/SearchPage";
import { fetchNowPlayingMovies } from "lib/movies/fetchNowPlayingMovies";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page() {
  const nowPlayingMovies = await fetchNowPlayingMovies();

  if (!nowPlayingMovies?.length) {
    return notFound();
  }

  return <SearchPage nowPlayingMovies={nowPlayingMovies} />;
}
