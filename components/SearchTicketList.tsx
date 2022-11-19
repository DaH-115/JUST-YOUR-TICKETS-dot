import styled from 'styled-components';
import { popMovie } from '../pages';

import Ticket from './Ticket';

const SearchTicketList = ({ movies }: { movies: popMovie[] }) => {
  return (
    <>
      <UserTicketTitle>검색결과</UserTicketTitle>
      <Wrapper>
        {movies.map((item: popMovie, index) => (
          <Ticket
            key={item.id}
            movieId={item.id}
            movieIndex={index + 1}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
            overview={item.overview}
          />
        ))}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  background-color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const UserTicketTitle = styled.h1`
  font-size: 1.8rem;
  color: #fff;
  padding-top: 1.4rem;
  padding-left: 1rem;

  ${({ theme }) => theme.device.desktop} {
    padding-top: 2rem;
    padding-left: 2rem;
    font-size: 2.4rem;
  }
`;

export default SearchTicketList;
