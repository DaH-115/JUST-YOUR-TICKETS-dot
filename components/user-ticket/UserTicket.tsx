import styled from 'styled-components';
import { UserTicketProps } from '../../pages/ticket-list';
import { BiPencil, BiTrash } from 'react-icons/bi';

import InfoButton from '../ticket/InfoButton';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import PosterImage from '../ticket/PosterImage';
import Link from 'next/link';

const UserTicket = ({
  id: ticketId,
  title,
  releaseYear,
  posterImage,
  rating,
  reviewText,
  createdAt,
}: UserTicketProps) => {
  const writeDate = new Date(createdAt).toLocaleDateString();

  return (
    <TicketWrapper>
      <MovieIndex>
        <WriteDate>{writeDate}</WriteDate>

        {/* [TEST] 🎈 DELETE BUTTON */}
        <ButtonWrapper>
          <StyledBtn>
            <button>
              <BiTrash />
            </button>
          </StyledBtn>

          {/* [TEST] 🎈 GO TO "/write" PAGE BUTTON */}
          <Link
            href={{
              pathname: '/write',
              query: {
                ticketId,
                title,
                releaseYear,
                rating,
                reviewText,
                posterImage: `https://image.tmdb.org/t/p/w500/${posterImage}`,
              },
            }}
            as={`/write`}
          >
            <StyledBtn>
              <button>
                <BiPencil />
              </button>
            </StyledBtn>
          </Link>

          {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
          <InfoButton
            title={title}
            releaseYear={releaseYear}
            posterPath={posterImage}
            voteAverage={rating}
            overview={reviewText}
          />
        </ButtonWrapper>
      </MovieIndex>

      {/* 🎈 POSTER IMAGE Section */}
      <PosterImage title={title} posterPath={posterImage} />

      {/* 🎈 TICKET MOVIE DETAIL Section */}
      <MovieTicketDetail
        title={title}
        releaseYear={releaseYear}
        voteAverage={rating}
        posterPath={posterImage}
        reviewText={reviewText}
      />
    </TicketWrapper>
  );
};

export default UserTicket;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const StyledBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 0.5rem;
  height: 0.5rem;
  padding: 1rem 0.8rem;
  border-radius: 50%;

  button {
    color: #fff;
    font-size: 1rem;
    line-height: 1rem;
    margin-right: 1rem;
  }
`;

// const UpdateBtn = styled(StyledBtn)``;

// const DeleteBtn = styled(StyledBtn)``;

const TicketWrapper = styled.div`
  width: 360px;
  margin-top: 4rem;
  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));

  &:hover {
    transform: translateY(-2rem);
    transition: transform ease-in-out 250ms;
  }
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
