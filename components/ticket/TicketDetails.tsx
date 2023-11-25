import React from 'react';
import styled from 'styled-components';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';

export interface TicketDetailsProps {
  title: string;
  releaseYear: string;
  voteAverage: number;
  genres?: string[];
  posterPath?: string;
  reviewText?: string;
  movieId?: number;
}

const TicketDetails = ({
  title,
  releaseYear,
  voteAverage,
  genres,
  reviewText,
  movieId,
}: TicketDetailsProps) => {
  return (
    <TicketDetailWrapper>
      <TicketTextDetail
        title={title}
        releaseYear={releaseYear}
        voteAverage={voteAverage}
        genres={genres}
        reviewText={reviewText}
      />

      {!reviewText && <AdmitBtn movieId={movieId!} />}
    </TicketDetailWrapper>
  );
};

export default React.memo(TicketDetails);

const TicketDetailWrapper = styled.div`
  position: relative;
  bottom: 1rem;
  left: 0;

  display: flex;
  justify-content: center;

  /* Poster Img Size */
  width: ${({ theme }) => theme.posterWidth};

  ${({ theme }) => theme.device.tablet} {
    bottom: 3.8rem;
  }
`;
