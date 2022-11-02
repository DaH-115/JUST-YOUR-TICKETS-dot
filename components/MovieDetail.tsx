import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';

interface MovieDetailProps {
  rating: number;
  title: string;
  releaseDate: string;
  desc?: string;
  janre: string[];
}

const MovieDetail = ({ ...props }: MovieDetailProps) => {
  const date = props.releaseDate.slice(0, 4);

  return (
    <Wrapper>
      <TextWrapper>
        <MovieTitle>
          <h1>
            {props.title} ({date})
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
      <ButtonWrapper>
        <button>ADMIT ONE</button>
        <ArrowBtn>
          <AiOutlineArrowRight />
        </ArrowBtn>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
`;

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
    color: ${({ theme }) => theme.colors.greay};
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

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 5rem;
  height: 100%;
  background-color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.orange};
  border-top-left-radius: 1rem;
  border-end-start-radius: 1rem;

  button {
    padding-bottom: 8px;
    border-bottom: 2px solid #fff;
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  width: 2rem;
  height: 2rem;
  text-align: center;
  margin-top: 8px;
`;

export default MovieDetail;
