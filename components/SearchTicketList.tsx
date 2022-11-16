import styled from 'styled-components';
import { popMovie } from '../pages';

import Ticket from './Ticket';
import { MovieTitle } from './TopMovieList';

const SearchTicketList = ({ movies }: { movies: popMovie[] }) => {
  return (
    <>
      <UserTicketTitle>검색결과</UserTicketTitle>
      <Wrapper>
        {movies.map((item: popMovie) => (
          <Ticket
            key={item.id}
            movieId={item.id}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
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
`;

const UserTicketTitle = styled(MovieTitle)`
  font-size: 1.6rem;
`;

export default SearchTicketList;
