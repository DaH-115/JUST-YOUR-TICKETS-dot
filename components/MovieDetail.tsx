import styled from 'styled-components';

interface MovieDetailProps {
  rating: number | string;
  title: string;
  releaseYear: string;
  janre?: string[];
  overview?: string;
}

const MovieDetail = (props: MovieDetailProps) => {
  return (
    <TextWrapper>
      <MovieTitle>
        <h1>
          {props.title} ({props.releaseYear})
        </h1>
        <p>*{props.rating} /10</p>
      </MovieTitle>

      {props.janre && (
        <MovieJanreWrapper>
          {props.janre.map((item: string, i) => (
            <li key={i}> {item === 'Science Fiction' ? 'SF' : item}</li>
          ))}
        </MovieJanreWrapper>
      )}
    </TextWrapper>
  );
};

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  background-color: #fff;

  border-top-right-radius: '1.5rem';
  border-bottom-right-radius: 'none';
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

export default MovieDetail;
