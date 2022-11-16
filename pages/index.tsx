import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';

import BackgroundStyle from '../components/BackgroundStyle';
import TopMovieList from '../components/TopMovieList';

export interface popMovie {
  id: number;
  vote_average: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
}

const Home: NextPage<{ topTenMovies: popMovie[] }> = ({ topTenMovies }) => {
  return (
    <div>
      <BackgroundStyle customMessage='your💭' backgroundColor='black'>
        <TopMovieList movies={topTenMovies} />
      </BackgroundStyle>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  topTenMovies: popMovie[];
}> = async () => {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const { results }: { results: popMovie[] } = await res.data;
  const topTenMovies = results.splice(0, 10);

  return {
    props: { topTenMovies },
  };
};

export default Home;
