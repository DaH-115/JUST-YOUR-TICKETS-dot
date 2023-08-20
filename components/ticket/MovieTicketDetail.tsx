import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

import TicketTextDetail from 'components/ticket/TicketTextDetail';
import { TicketTextDetailProps } from 'ticketType';

const MovieTicketDetail = ({
  title,
  releaseYear,
  genres,
  voteAverage,
  posterPath,
  reviewText,
}: TicketTextDetailProps) => {
  return (
    <MovieTicketDetailWrapper>
      <TicketTextDetail
        title={title}
        releaseYear={releaseYear}
        voteAverage={voteAverage}
        genres={genres}
        reviewText={reviewText}
      />

      {/* GO TO "/write" PAGE BUTTON */}
      {!reviewText && (
        <Link
          href={{
            pathname: '/write',
            query: {
              title,
              releaseYear,
              posterImage: `https://image.tmdb.org/t/p/w500${posterPath}`,
            },
          }}
          as={`/write`}
        >
          <AdmitBtnWrapper>
            <button>
              <p>ADMIT ONE</p>
            </button>
            <ArrowBtn>
              <MdOutlineArrowForwardIos />
            </ArrowBtn>
          </AdmitBtnWrapper>
        </Link>
      )}
    </MovieTicketDetailWrapper>
  );
};

export default React.memo(MovieTicketDetail);

const MovieTicketDetailWrapper = styled.div`
  position: relative;
  bottom: 1.5rem;
  left: 0;

  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 25px rgba(50, 50, 50, 0.9));
`;

const AdmitBtnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  border-left: 0.2rem dashed ${({ theme }) => theme.colors.orange};

  button {
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: auto;

  color: ${({ theme }) => theme.colors.yellow};
  padding: 0.5rem 0;
`;
