import { Metadata } from "next";
import SearchPage from "app/search/search-page";
import { fetchNowPlayingMovies, Movie } from "api/fetchNowPlayingMovies";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
};

async function getNowPlayingMovies(): Promise<Movie[]> {
  try {
    const { results } = await fetchNowPlayingMovies();

    if (!results) {
      throw new Error("Invalid data received from API");
    }

    return results;
  } catch (error) {
    notFound();
  }
}

export default async function Page() {
  try {
    const nowPlayingMovies = await getNowPlayingMovies();

    return <SearchPage nowPlayingMovies={nowPlayingMovies} />;
  } catch (error) {
    notFound();
  }
}
