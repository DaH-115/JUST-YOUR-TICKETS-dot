import styled from 'styled-components';
import MovieTextDetail from './MovieTextDetail';
import AdmitBtn from './AdmitBtn';
import { MovieTicketDetailProps } from 'ticketType';
import React from 'react';

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
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;
