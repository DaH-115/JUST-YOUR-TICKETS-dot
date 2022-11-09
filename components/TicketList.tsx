import { NextPage } from 'next';
import styled from 'styled-components';
import { popMovie } from '../pages';

import Ticket from './Ticket';

const TicketList: NextPage<{ movies: popMovie[] }> = ({ movies }) => {
  return (
    <Wrapper>
      {movies.map((item) => (
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
  );
};

const Wrapper = styled.div`
  display: flex;
  overflow-y: scroll;
  padding-top: 1.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.colors.black};
`;

export default TicketList;
