import { useRouter } from 'next/router';
import styled from 'styled-components';
import { UserTicketProps } from '../../pages/ticket-list';

import InfoButton from '../ticket/InfoButton';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import PosterImage from '../ticket/PosterImage';

const UserTicket = (props: UserTicketProps) => {
  const writeDate = new Date(props.createdAt).toLocaleDateString();

  return (
    <TicketWrapper>
      <MovieIndex>
        <WriteDate>{writeDate}</WriteDate>

        {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
        <InfoButton
          title={props.title}
          releaseYear={props.releaseYear}
          posterPath={props.posterImage}
          voteAverage={props.rating}
          overview={props.reviewText}
        />
      </MovieIndex>

      {/* 🎈 POSTER IMAGE Section */}
      <PosterImage title={props.title} posterPath={props.posterImage} />

      {/* 🎈 TICKET MOVIE DETAIL Section */}
      <MovieTicketDetail
        title={props.title}
        releaseYear={props.releaseYear}
        voteAverage={props.rating}
        posterPath={props.posterImage}
        reviewText={props.reviewText}
      />
    </TicketWrapper>
  );
};

export default UserTicket;

const TicketWrapper = styled.div`
  width: 360px;
  margin-top: 2rem;
  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));
`;

const MovieIndex = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  color: #fff;

  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.black} 40%,
    transparent
  );
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 0.5rem 0.8rem 0 1.4rem;
`;

const WriteDate = styled.p`
  font-size: 1rem;
  font-weight: 700;
`;
