import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';

import MovieDetail from './MovieDetail';
import Link from 'next/link';

interface TicketProps {
  movieId?: number;
  reviewText?: string;
  voteAverage: number | string;
  title: string;
  releaseDate: string;
  posterPath: string | null;
}

const Ticket = (props: TicketProps) => {
  const [janre, setJanre] = useState([]);
  const movieId = props.movieId;
  const releaseYear = props.releaseDate.slice(0, 4);
  const admitBtnState = Boolean(props.reviewText);

  useEffect(() => {
    if (movieId) {
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
    }
  }, [movieId]);

  return (
    <>
      <TicketWrapper>
        {!props.posterPath ? (
          <ImgBox>
            <NoneImg>IMAGE IS NONE</NoneImg>
          </ImgBox>
        ) : (
          <ImgBox>
            <Image
              className='Fuck'
              src={`https://image.tmdb.org/t/p/w500/${props.posterPath}`}
              alt={props.title}
              width={360}
              height={560}
            />
          </ImgBox>
        )}
        <MovieDetailWrapper>
          <MovieDetail
            title={props.title}
            releaseYear={releaseYear}
            rating={props.voteAverage}
            reviewText={props.reviewText}
            janre={janre}
          />
          {!admitBtnState && (
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
              <AdmitButtonWrapper>
                <button>Admit ONE</button>
                <ArrowBtn>
                  <AiOutlineArrowRight />
                </ArrowBtn>
              </AdmitButtonWrapper>
            </Link>
          )}
        </MovieDetailWrapper>
      </TicketWrapper>
    </>
  );
};

const TicketWrapper = styled.div`
  padding-top: 1.8rem;
  padding-bottom: 2rem;
  padding-left: 1rem;

  &:last-child {
    padding-right: 1rem;
  }

  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.1));
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: auto;
  overflow: hidden;
  border-radius: 1.5rem;

  Img {
    border-radius: 1.5rem;
  }

  &:hover,
  &:active {
    Img {
      scale: 110%;
      transition: scale ease-in 150ms;
    }
  }
`;

const NoneImg = styled.div`
  width: 360px;
  height: 560px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;

const MovieDetailWrapper = styled.div`
  position: relative;
  bottom: 1.6rem;
  left: 0;
  display: flex;
  width: 100%;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;

const AdmitButtonWrapper = styled.div`
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
  border-bottom-right-radius: 1.5rem;

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
