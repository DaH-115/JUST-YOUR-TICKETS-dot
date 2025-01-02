import { Metadata } from "next";
import SearchPage from "app/search/search-page";

export const metadata: Metadata = {
  title: "Search",
};

export default function Page() {
  return <SearchPage />;
}
