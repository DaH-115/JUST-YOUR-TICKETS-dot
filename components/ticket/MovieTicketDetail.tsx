import React from 'react';
import styled from 'styled-components';

import MovieTextDetail from 'components/ticket/MovieTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';
import { MovieTicketDetailProps } from 'ticketType';

const MovieTicketDetail = ({
  title,
  releaseYear,
  janres,
  voteAverage,
  posterPath,
  reviewText,
}: MovieTicketDetailProps) => {
  return (
    <MovieDetailWrapper>
      <MovieTextDetail
        title={title}
        releaseYear={releaseYear}
        voteAverage={voteAverage}
        janres={janres}
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
    </MovieDetailWrapper>
  );
};

export default React.memo(MovieTicketDetail);

const MovieDetailWrapper = styled.div`
  position: relative;
  bottom: 1.5rem;
  left: 0;

  display: flex;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 25px rgba(50, 50, 50, 0.9));
`;
