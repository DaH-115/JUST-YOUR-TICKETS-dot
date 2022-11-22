import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';

import BackgroundStyle from '../components/BackgroundStyle';
import SlideList from '../components/SlideList';
import TopMovieSlider from '../components/TopMovieSlider';

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
    <BackgroundStyle customMessage='your💭' backgroundColor='black'>
      <SlideList title='인기 영화 10'>
        <TopMovieSlider movies={topTenMovies} />
      </SlideList>
    </BackgroundStyle>
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
