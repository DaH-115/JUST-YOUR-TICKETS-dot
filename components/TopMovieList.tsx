import styled from 'styled-components';
import { popMovie } from '../pages';

import Ticket from './Ticket';

const TopMovieList = ({ movies }: { movies: popMovie[] }) => {
  return (
    <SlideWrapper>
      <MovieTitle>인기 영화 10</MovieTitle>
      <Wrapper>
        {movies.map((item: popMovie, index) => (
          <Ticket
            key={item.id}
            movieId={item.id}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
            movieIndex={index + 1}
          />
        ))}
      </Wrapper>
    </SlideWrapper>
  );
};

export const MovieTitle = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  padding: 0 1rem;
`;

const SlideWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  overflow-x: scroll;
`;

const Wrapper = styled.div`
  display: flex;
`;

export default TopMovieList;
