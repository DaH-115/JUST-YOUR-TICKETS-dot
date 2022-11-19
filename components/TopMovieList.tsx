import styled from 'styled-components';
import { popMovie } from '../pages';

import Ticket from './Ticket';

const TopMovieList = ({ movies }: { movies: popMovie[] }) => {
  return (
    <>
      <MovieTitle>인기영화 10</MovieTitle>
      <SlideWrapper>
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
              overview={item.overview}
            />
          ))}
        </Wrapper>
      </SlideWrapper>
    </>
  );
};

export const MovieTitle = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  padding-left: 1rem;
  font-weight: 600;

  ${({ theme }) => theme.device.desktop} {
    padding-left: 2rem;
    font-size: 2.4rem;
    font-weight: 700;
  }
`;

const SlideWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  overflow-x: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const Wrapper = styled.div`
  display: flex;
`;

export default TopMovieList;
