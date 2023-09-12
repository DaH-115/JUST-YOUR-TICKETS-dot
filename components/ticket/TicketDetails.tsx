import React from 'react';
import styled from 'styled-components';
import { TicketDetailProps } from 'ticketType';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';

const TicketDetails = ({
  title,
  releaseYear,
  voteAverage,
  genres,
  posterPath,
  reviewText,
}: TicketDetailProps) => {
  return (
    <TicketDetailWrapper>
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
