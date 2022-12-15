import styled from 'styled-components';
import { MovieTextDetailProps } from 'ticketType';

const MovieTextDetail = ({
  title,
  voteAverage,
  releaseYear,
  reviewText,
  janres,
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

      {janres && (
        <MovieJanreWrapper>
          {janres.map((item: string, index) => (
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
  border-left: 0.5rem solid ${({ theme }) => theme.colors.orange};
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

const MovieJanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 2rem;
  overflow-y: scroll;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

    &::before {
      content: '/';
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

const StyledReviewText = styled.p`
  width: 100%;
  height: 3rem;
  margin: 1rem 0;
  margin-top: 0.5rem;
  overflow: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;
