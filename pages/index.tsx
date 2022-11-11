import { GetStaticProps, NextPage } from 'next';
import axios from 'axios';
import styled from 'styled-components';

import BackgroundStyle from '../components/BackgroundStyle';
import TicketList from '../components/TicketList';

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
        <MovieTitle>인기 영화 10</MovieTitle>
        <TicketList movies={topTenMovies} />
      </BackgroundStyle>
    </div>
  );
};

const MovieTitle = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  padding: 0 1rem;
`;

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
