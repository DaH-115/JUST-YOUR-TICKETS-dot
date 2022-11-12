import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';

import MovieDetail from './MovieDetail';
import Link from 'next/link';

interface TicketProps {
  id: number;
  voteAverage: number;
  title: string;
  overview: string;
  releaseDate: string;
  posterPath: string | null;
}

const Ticket = ({ ...props }: TicketProps) => {
  const [janre, setJanre] = useState([]);
  const movieId = props.id;

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const data = await res.data;

      const result = data.genres.map(
        (item: { id: number; name: string }) => item.name
      );

      setJanre(result);
    })();
  }, [movieId]);

  return (
    <>
      <Wrapper>
        {!props.posterPath ? (
          <ImgBox>
            <NoneImg>IMAGE IS NONE</NoneImg>
          </ImgBox>
        ) : (
          <ImgBox>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${props.posterPath}`}
              alt={props.title}
              width={350}
              height={550}
            />
          </ImgBox>
        )}
        <MovieDetailWrapper>
          <MovieDetail
            title={props.title}
            releaseDate={props.releaseDate}
            rating={props.voteAverage}
            desc={props.overview}
            janre={janre}
          />
          <Link
            href={{
              pathname: '/write',
              query: {
                title: props.title,
                releaseDate: props.releaseDate,
                posterImage: `https://image.tmdb.org/t/p/w500/${props.posterPath}`,
              },
            }}
            as={`/write`}
          >
            <ButtonWrapper>
              <button>ADMIT ONE</button>
              <ArrowBtn>
                <AiOutlineArrowRight />
              </ArrowBtn>
            </ButtonWrapper>
          </Link>
        </MovieDetailWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: auto;
  height: 100%;
  margin-right: 1rem;
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.1));
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
`;

const NoneImg = styled.div`
  width: 350px;
  height: 550px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;

const MovieDetailWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
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

export default Ticket;
