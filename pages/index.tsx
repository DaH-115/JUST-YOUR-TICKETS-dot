import type { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import Ticket from '../components/Ticket';
import BackgroundStyle from '../components/BackgroundStyle';
import styled from 'styled-components';

interface popMovie {
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
      <BackgroundStyle customMessage='your💭'>
        <MovieTitle>인기 영화 10</MovieTitle>
        <Wrapper>
          {topTenMovies.map((item) => (
            <Ticket
              key={item.id}
              id={item.id}
              title={item.title}
              voteAverage={item.vote_average}
              releaseDate={item.release_date}
              overview={item.overview}
              posterPath={item.poster_path}
            />
          ))}
        </Wrapper>
      </BackgroundStyle>
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  padding: 1rem;
`;

const MovieTitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  padding: 1rem 1rem 0 1rem;
`;

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
  );
  const { results } = await res.data;
  const topTenMovies = results.splice(0, 10);
  return {
    props: { topTenMovies },
  };
};

export default Home;
