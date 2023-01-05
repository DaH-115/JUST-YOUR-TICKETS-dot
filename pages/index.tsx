import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';

import BackgroundStyle from 'components/layout/BackgroundStyle';
import SlideList from 'components/slider/SlideList';
import TopMovieSlider from 'components/home/TopMovieSlider';
import { TopMovieDataProps } from 'ticketType';

const Home: NextPage<{ topMovies: TopMovieDataProps[] }> = ({ topMovies }) => {
  return (
    <BackgroundStyle customMessage='your💭'>
      <SlideList
        title='인기 영화 10'
        description='지금 인기 있는 영화를 확인해 보세요!'
      >
        <TopMovieSlider movies={topMovies} />
      </SlideList>
    </BackgroundStyle>
  );
};

export const getStaticProps: GetStaticProps<{
  topMovies: TopMovieDataProps[];
}> = async () => {
  let topMovies: TopMovieDataProps[] = [];

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
      {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
      }
    );
    const { results }: { results: TopMovieDataProps[] } = await res.data;

    topMovies = results.splice(0, 10);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { topMovies },
    revalidate: 86400,
  };
};

export default Home;
