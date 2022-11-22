import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';

import InfoButton from './InfoButton';
import PosterImage from './PosterImage';
import MovieTicketDetail from './MovieTicketDetail';

interface TicketProps {
  title: string;
  releaseDate: string;
  voteAverage: number | string;
  posterPath?: string;
  movieId?: number;
  movieIndex?: number;
  writeDate?: number;
  reviewText?: string;
  overview?: string;
}

const MovieTicket = (props: TicketProps) => {
  const router = useRouter();
  const [janre, setJanre] = useState<string[]>([]);
  const movieId = props.movieId;
  const releaseYear = props.releaseDate.slice(0, 4);

  // 🎈 GET Genres
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
    <TicketWrapper>
      {/* 🎈 TICKET INDEX HEADER */}
      <MovieIndex routePath={router.pathname}>
        <MovieRank>
          {props.movieIndex! > 10
            ? String(props.movieIndex).slice(-1)
            : props.movieIndex}
        </MovieRank>

        {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
        <InfoButton
          title={props.title}
          releaseYear={releaseYear}
          posterPath={props.posterPath}
          voteAverage={props.voteAverage}
          janre={janre}
          overview={props.overview}
        />
      </MovieIndex>

      {/* 🎈 POSTER IMAGE Section */}
      <PosterImage title={props.title} posterPath={props.posterPath} />

      {/* 🎈 TICKET MOVIE DETAIL Section */}
      <MovieTicketDetail
        title={props.title}
        releaseYear={releaseYear}
        voteAverage={props.voteAverage}
        janre={janre}
        posterPath={props.posterPath}
      />
    </TicketWrapper>
  );
};

const TicketWrapper = styled.div`
  width: 360px;
  margin-top: 2rem;
  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));
`;

const MovieIndex = styled.div<{ routePath: string }>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 4rem;
  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.black} 40%,
    transparent
  );
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 0.5rem 0.8rem 0 1.4rem;
`;

const MovieRank = styled.p`
  font-size: 3rem;
`;

export default MovieTicket;
