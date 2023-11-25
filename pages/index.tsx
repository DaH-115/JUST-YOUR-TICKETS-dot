import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import { MovieDataProps } from 'ticketType';
import SlideLayout from 'components/slider/SlideLayout';
import TopTenMovieTicket from 'components/ticket/top10-tickets/TopTenMovieTicket';
import TicketSlider from 'components/slider/TicketSlider';

const Home: NextPage<{ topTenMovies: MovieDataProps[] }> = ({
  topTenMovies,
}) => {
  return (
    <SlideLayout
      title='인기 영화 10'
      description='지금 가장 인기 있는 영화를 확인해 보세요!'
    >
      <TicketSlider movieLength={topTenMovies.length}>
        {topTenMovies.map((item: MovieDataProps, index) => (
          <TopTenMovieTicket
            key={item.id}
            movieId={item.id}
            movieIndex={index + 1}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
          />
        ))}
      </TicketSlider>
    </SlideLayout>
  );
};

export const getStaticProps: GetStaticProps<{
  topTenMovies: MovieDataProps[];
}> = async () => {
  let topTenMovies: MovieDataProps[] = [];

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`,
      {
        headers: { 'Accept-Encoding': 'gzip, deflate, compress' },
      }
    );
    const { results }: { results: MovieDataProps[] } = await res.data;

    topTenMovies = results.splice(0, 10);
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { topTenMovies },
    revalidate: 3600,
  };
};

export default Home;
