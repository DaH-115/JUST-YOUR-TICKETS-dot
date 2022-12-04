import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetJanres from '../hooks/useGetJanres';

import InfoButton from '../ticket/InfoButton';
import PosterImage from '../ticket/PosterImage';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import { TicketWrapper } from '../styles/TicketWrapper';
import { MovieIndexBar } from '../styles/MovieIndexBar';

export interface TicketProps {
  title: string;
  releaseDate: string;
  movieId: number;
  movieIndex: number;
  voteAverage: number | string;
  posterPath?: string;
  overview?: string;
}

const MovieTicket = (props: TicketProps) => {
  const router = useRouter();
  const janres = useGetJanres(props.movieId);
  const releaseYear = props.releaseDate.slice(0, 4);

  return (
    <TicketWrapper>
      {/* 🎈 TICKET INDEX HEADER */}
      <MovieIndexBar routePath={router.pathname}>
        <MovieRank>{props.movieIndex}</MovieRank>

        {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
        <InfoButton
          title={props.title}
          releaseYear={releaseYear}
          posterPath={props.posterPath}
          voteAverage={props.voteAverage}
          janre={janres}
          overview={props.overview}
        />
      </MovieIndexBar>

      {/* 🎈 POSTER IMAGE */}
      <PosterImage title={props.title} posterPath={props.posterPath} />

      {/* 🎈 TICKET DETAIL */}
      <MovieTicketDetail
        title={props.title}
        releaseYear={releaseYear}
        voteAverage={props.voteAverage}
        janre={janres}
        posterPath={props.posterPath}
      />
    </TicketWrapper>
  );
};

export default MovieTicket;

const MovieRank = styled.p`
  font-size: 3rem;
`;
