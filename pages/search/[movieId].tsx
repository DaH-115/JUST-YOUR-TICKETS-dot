import axios from 'axios';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import MovieDetail from 'components/movie-detail/MovieDetailPage';
import { Top10MovieDataProps } from 'ticketType';

const SearchListDetailPage: NextPage<{ movie: Top10MovieDataProps }> = ({
  movie,
}) => {
  return (
    <MovieDetail
      movieId={movie.id}
      title={movie.title}
      releaseDate={movie.release_date}
      voteAverage={movie.vote_average}
      overview={movie.overview}
      posterPath={movie.poster_path}
    />
  );
};

export default SearchListDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];

  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`
  );
  const { results } = await res.data;

  paths = results.map((item: { id: number }) => ({
    params: { movieId: item.id.toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<{
  movie: Top10MovieDataProps;
}> = async ({ params }: GetStaticPropsContext) => {
  const movieId = params && params.movieId;
  let movie: Top10MovieDataProps;

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_THEMOVIEDB_API_KEY}&language=ko-KR`
    );
    movie = res.data;
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { movie },
  };
};
