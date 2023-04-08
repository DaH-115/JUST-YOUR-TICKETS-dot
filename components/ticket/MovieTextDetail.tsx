import styled from 'styled-components';
import { MovieTextDetailProps } from 'ticketType';
import MovieJanreWrapper from 'components/styles/MovieJanreWrapper';

const MovieTextDetail = ({
  title,
  voteAverage,
  releaseYear,
  reviewText,
  genres,
}: MovieTextDetailProps) => {
  return (
    <TextWrapper>
      <MovieTitle>
        <h1>
          {title} ({releaseYear})
        </h1>
        <MovieRating>
          <p>{`${Math.round(voteAverage)} /10`}</p>
        </MovieRating>
      </MovieTitle>

      {genres && (
        <MovieJanreWrapper>
          {genres.map((item: string, index) => (
            <li key={index}>{item === 'Science Fiction' ? 'SF' : item}</li>
          ))}
        </MovieJanreWrapper>
      )}

      {reviewText && <StyledReviewText>{reviewText}</StyledReviewText>}
    </TextWrapper>
  );
};

export default MovieTextDetail;

const TextWrapper = styled.div`
  width: 100%;
  height: 8rem;
  padding: 0.5rem;
  box-sizing: border-box;
  background: linear-gradient(white 80%, ${({ theme }) => theme.colors.yellow});
  border-left: 0.2rem solid ${({ theme }) => theme.colors.orange};
`;

const MovieTitle = styled.div`
  width: auto;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.black};
  overflow-y: scroll;
  margin-bottom: 0.5rem;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  h1 {
    font-weight: 700;
  }
`;

const MovieRating = styled.div`
  display: flex;
  margin-top: 0.5rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.colors.orange};

  p {
    font-weight: 700;
    line-height: 1rem;
  }
`;

const StyledReviewText = styled.p`
  width: 100%;
  height: 3rem;
  margin: 1rem 0;
  margin-top: 0.5rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;
