import React from 'react';
import styled from 'styled-components';

import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from './AdmitBtn';
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
  position: relative;
  bottom: 1.5rem;
  left: 0;

  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 25px rgba(50, 50, 50, 0.9));
`;
