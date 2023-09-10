import React from 'react';
import styled from 'styled-components';

import { TicketTextDetailProps } from 'ticketType';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from './AdmitBtn';

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

      {!reviewText && (
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
      )}
    </MovieTicketDetailWrapper>
  );
};

export default React.memo(MovieTicketDetail);

const MovieTicketDetailWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;

  display: flex;
  justify-content: center;

  /* Poster Img Size */
  width: 100%;
  width: ${({ theme }) => theme.posterWidth};
  height: 7rem;
`;
