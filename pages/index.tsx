import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import { Top10MovieDataProps } from 'ticketType';
import SlideLayout from 'components/slider/SlideLayout';
import TopTenMovieSlider from 'components/top10-tickets/TopTenMovieSlider';

const Home: NextPage<{ top10Movies: Top10MovieDataProps[] }> = ({
  top10Movies,
}) => {
  return (
    <SlideLayout
      title='인기 영화 10'
      description='지금 가장 인기 있는 영화를 확인해 보세요!'
    >
      <TopTenMovieSlider movies={top10Movies} />
    </SlideLayout>
  );
};

export const getStaticProps: GetStaticProps<{
  top10Movies: Top10MovieDataProps[];
}> = async () => {
  let top10Movies: Top10MovieDataProps[] = [];

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
      {
        headers: { 'Accept-Encoding': 'gzip, deflate, compress' },
      }
    );
    const { results }: { results: Top10MovieDataProps[] } = await res.data;

    top10Movies = results.splice(0, 10);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { top10Movies },
    revalidate: 86400,
  };
};

export default Home;
