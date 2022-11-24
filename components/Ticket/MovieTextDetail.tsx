import styled from 'styled-components';

interface MovieTextProps {
  title: string;
  voteAverage: number | string;
  releaseYear: string;
  reviewText?: string;
  janre?: string[];
}

const MovieTextDetail = ({
  voteAverage,
  title,
  releaseYear,
  reviewText,
  janre,
}: MovieTextProps) => {
  return (
    <TextWrapper reviewState={reviewText!}>
      <MovieTitle>
        <h1>
          {title} ({releaseYear})
        </h1>
        <p>*{voteAverage} /10</p>
      </MovieTitle>

      {janre && (
        <MovieJanreWrapper>
          {janre.map((item: string, i) => (
            <li key={i}>{item === 'Science Fiction' ? 'SF' : item}</li>
          ))}
        </MovieJanreWrapper>
      )}

      {reviewText && <StyledReviewText>{reviewText}</StyledReviewText>}
    </TextWrapper>
  );
};

export default MovieTextDetail;

const TextWrapper = styled.div<{ reviewState: string }>`
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  background: linear-gradient(white 80%, ${({ theme }) => theme.colors.yellow});
  border-left: 0.5rem solid ${({ theme }) => theme.colors.orange};
`;

const MovieTitle = styled.div`
  width: auto;
  height: 3.5rem;
  font-size: 0.5rem;
  color: ${({ theme }) => theme.colors.black};
  border-bottom: 0.1rem solid ${({ theme }) => theme.colors.black};
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  h1 {
    font-size: 1rem;
    font-weight: 700;
    padding: 0;
  }

  p {
    font-size: 1rem;
    padding: 0.3rem 0;
  }
`;

const MovieJanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 2rem;
  overflow-y: scroll;
  margin-top: 0.4rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

    &::before {
      content: '/ ';
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

const StyledReviewText = styled.p`
  width: 100%;
  margin-top: 0.5rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;
