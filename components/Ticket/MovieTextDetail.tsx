import styled from 'styled-components';

interface MovieTextProps {
  title: string;
  rating: number | string;
  releaseYear: string;
  reviewText?: string;
  janre?: string[];
}

const MovieTextDetail = ({
  rating,
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
        <p>*{rating} /10</p>
      </MovieTitle>

      {janre && (
        <MovieJanreWrapper>
          {janre.map((item: string, i) => (
            <li key={i}> {item === 'Science Fiction' ? 'SF' : item}</li>
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
  height: 100%;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  background-color: #fff;

  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: ${({ reviewState }) =>
    reviewState ? '1.5rem' : 'none'};
  border-bottom-left-radius: 1.5rem;
`;

const MovieTitle = styled.div`
  font-size: 0.5rem;
  color: ${({ theme }) => theme.colors.black};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};

  h1 {
    font-size: 1.2rem;
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
  overflow-y: scroll;
  margin-top: 0.4rem;
  font-size: 0.8rem;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

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
