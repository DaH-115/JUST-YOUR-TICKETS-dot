import styled from 'styled-components';

interface MovieDetailProps {
  rating: number;
  title: string;
  releaseDate: string;
  desc?: string;
  janre: string[];
}

const MovieDetail = ({ ...props }: MovieDetailProps) => {
  const releaseYear = props.releaseDate.slice(0, 4);

  return (
    <TextWrapper>
      <MovieTitle>
        <h1>
          {props.title} ({releaseYear})
        </h1>
      </MovieTitle>
      <p>*{props.rating} /10</p>
      <MovieJanreWrapper>
        {props.janre.map((item, i) => (
          <p key={i}>{item}</p>
        ))}
      </MovieJanreWrapper>
      <span>Just Your Tickets.</span>
    </TextWrapper>
  );
};

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  background-color: #fff;
  border-top-right-radius: 1rem;
  border-end-end-radius: 1rem;

  span {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray};
  }

  /* &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }

  &:active {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  } */
`;

const MovieTitle = styled.div`
  font-size: 0.5rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.black};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
`;

const MovieJanreWrapper = styled.div`
  /* display: flex; */
  margin-top: 0.5rem;
  width: 80%;
  height: 40%;
  overflow-y: scroll;

  p {
    margin-right: 8px;
  }
`;

export default MovieDetail;
