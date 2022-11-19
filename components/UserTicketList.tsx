import styled from 'styled-components';
import { usersTicketProps } from '../pages/ticket-list';

import Ticket from './Ticket';
import { MovieTitle } from './TopMovieList';

const UserTicketList = ({ movies }: { movies: usersTicketProps[] }) => {
  return (
    <>
      <UserTicketTitle>
        나의 감상티켓
        <p>총 {movies.length}장</p>
      </UserTicketTitle>
      <Wrapper>
        {movies.map((item: usersTicketProps, index) => (
          <Ticket
            key={item.id}
            movieIndex={index + 1}
            writeDate={item.createdAt}
            title={item.title}
            voteAverage={item.rating}
            releaseDate={item.releaseYear}
            reviewText={item.reviewText}
            posterPath={item.posterImage}
          />
        ))}
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.black};
  overflow-x: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const UserTicketTitle = styled(MovieTitle)`
  font-size: 1.6rem;
  line-height: 2rem;
`;

export default UserTicketList;
