import styled from 'styled-components';

interface MovieDetailProps {
  rating: number | string;
  title: string;
  releaseYear: string;
  reviewText?: string;
  overview?: string;
  janre?: string[];
}

const MovieDetail = (props: MovieDetailProps) => {
  return (
    <TextWrapper reviewText={props.reviewText}>
      <MovieTitle>
        <h1>
          {props.title} ({props.releaseYear})
        </h1>
        <p>*{props.rating} /10</p>
      </MovieTitle>
      {props.reviewText && (
        <StyledReviewText>
          <p>{props.reviewText}</p>
        </StyledReviewText>
      )}

      {props.janre && (
        <MovieJanreWrapper>
          {props.janre.map((item: string, i) => (
            <p key={i}>{item === 'Science Fiction' ? 'SF' : item}</p>
          ))}
        </MovieJanreWrapper>
      )}
    </TextWrapper>
  );
};

const TextWrapper = styled.div<{ reviewText: string | undefined }>`
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  background-color: #fff;

  border-top-right-radius: ${({ reviewText }) =>
    !reviewText ? '1.5rem' : 'none'};
  border-bottom-right-radius: ${({ reviewText }) =>
    !reviewText ? 'none' : '1.5rem'};
  border-bottom-left-radius: 1.5rem;
`;

const MovieTitle = styled.div`
  font-size: 0.5rem;
  color: ${({ theme }) => theme.colors.black};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};

  h1 {
    padding: 0;
  }

  p {
    font-size: 1rem;
    padding: 0.3rem 0;
  }
`;

const MovieJanreWrapper = styled.div`
  display: flex;
  width: auto;
  overflow-x: scroll;
  margin-top: 0.2rem;
  font-size: 0.8rem;

  p {
    margin-right: 0.4rem;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const StyledReviewText = styled.div`
  width: 100%;
  padding: 1rem 0;
`;

export default MovieDetail;
