import styled from 'styled-components';
import MovieTextDetail from './MovieTextDetail';
import AdmitBtn from './AdmitBtn';

interface TicketDetailProps {
  title: string;
  voteAverage: number | string;
  releaseYear: string;
  posterPath?: string;
  reviewText?: string;
  janre?: string[];
}

const MovieTicketDetail = ({
  title,
  voteAverage,
  releaseYear,
  posterPath,
  reviewText,
  janre,
}: TicketDetailProps) => {
  return (
    <MovieDetailWrapper>
      <MovieTextDetail
        title={title}
        releaseYear={releaseYear}
        rating={voteAverage}
        reviewText={reviewText}
        janre={janre}
      />

      {/* 🎈 GO TO "/write" PAGE BUTTON */}
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

export default MovieTicketDetail;

const MovieDetailWrapper = styled.div`
  position: relative;
  bottom: 3rem;
  left: 0;
  display: flex;
  width: 100%;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;
