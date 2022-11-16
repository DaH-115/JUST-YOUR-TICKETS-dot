import styled from 'styled-components';
import { usersTicketProps } from '../pages/ticket-list';

import Ticket from './Ticket';
import { MovieTitle } from './TopMovieList';

const UserTicketList = ({ movies }: { movies: usersTicketProps[] }) => {
  return (
    <>
      <UserTicketTitle>나의 감상티켓</UserTicketTitle>
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
  overflow-x: scroll;
  background-color: ${({ theme }) => theme.colors.black};
`;

const UserTicketTitle = styled(MovieTitle)`
  font-size: 1.6rem;
`;

export default UserTicketList;
