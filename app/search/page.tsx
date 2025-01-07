import { Metadata } from "next";
import SearchPage from "app/search/search-page";
import { fetchNowPlayingMovies } from "api/fetchNowPlayingMovies";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
};

export default async function Page() {
  try {
    const { results: nowPlayingMovies } = await fetchNowPlayingMovies();

    return <SearchPage nowPlayingMovies={nowPlayingMovies} />;
  } catch (error) {
    notFound();
  }
}
