import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { AiFillInfoCircle } from 'react-icons/ai';

import MovieDetail from './MovieDetail';
import { useRouter } from 'next/router';

interface TicketProps {
  movieId?: number;
  movieIndex?: number;
  writeDate?: number;
  reviewText?: string;
  overview?: string;
  posterPath: string | null;
  title: string;
  releaseDate: string;
  voteAverage: number | string;
}

const Ticket = (props: TicketProps) => {
  const router = useRouter();
  const [janre, setJanre] = useState<string[]>([]);
  const movieId = props.movieId;
  const releaseYear = props.releaseDate.slice(0, 4);
  const writeDate = new Date(props.writeDate!).toLocaleDateString();

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
        <MovieIndex routePath={router.pathname}>
          {router.pathname === '/' || router.pathname === '/search'
            ? `${props.movieIndex}.`
            : `${writeDate}`}
          {router.pathname === '/ticket-list' || (
            <Link
              href={{
                pathname: `/search/${props.title}`,
                query: {
                  title: props.title,
                  releaseDate: releaseYear,
                  posterImage: `https://image.tmdb.org/t/p/w500/${props.posterPath}`,
                  voteAverage: props.voteAverage,
                  janre,
                  overview: props.overview,
                },
              }}
              as={`/search/${props.title}`}
            >
              <StyeldInfo>
                <AiFillInfoCircle />
              </StyeldInfo>
            </Link>
          )}
        </MovieIndex>

        {!props.posterPath ? (
          <ImgBox>
            <NoneImg>IMAGE IS NONE</NoneImg>
          </ImgBox>
        ) : (
          <ImgBox>
            <Image
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
          {!props.reviewText && (
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
                <button>ADMIT ONE</button>
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
  width: 360px;
  margin: 2rem 1rem 2rem 1rem;

  &:last-child {
    margin-right: 1rem;
  }

  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));
`;

const MovieIndex = styled.div<{ routePath: string }>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3rem;
  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(180deg, black 30%, transparent);
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 0.5rem 0.8rem 0 1.4rem;
`;

const StyeldInfo = styled.div`
  font-size: 1.8rem;
  color: #fff;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
  }
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 360px;
  overflow: hidden;
  border-radius: 1.5rem;

  Img {
    width: 100%;
    border-radius: 1.5rem;
  }

  &:hover {
    Img {
      scale: 105%;
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
  width: 360px;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;

const AdmitButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
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
