import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetJanres from '../../hooks/useGetJanres';

import PosterImage from '../ticket/PosterImage';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import MovieInfoBtn from '../ticket/MovieInfoBtn';
import { TicketWrapper } from '../styles/TicketWrapper';
import { MovieIndexBar } from '../styles/MovieIndexBar';
import { MovieTicketProps } from 'ticketType';

const TopMovieTicket = ({
  movieId,
  releaseDate,
  movieIndex,
  title,
  posterPath,
  voteAverage,
}: MovieTicketProps) => {
  const router = useRouter();
  const janres = useGetJanres(movieId);
  const releaseYear = releaseDate.slice(0, 4);

  return (
    <TicketWrapper>
      {/* TICKET INDEX HEADER */}
      <MovieIndexBar routePath={router.pathname}>
        <MovieRank>{`* ${movieIndex}`}</MovieRank>

        {/* GO TO MOVIE INFO PAGE BUTTON */}
        <MovieInfoBtn movieId={movieId} />
      </MovieIndexBar>

      {/* POSTER IMAGE */}
      <PosterImage title={title} posterPath={posterPath} />

      {/* TICKET DETAIL */}
      <MovieTicketDetail
        title={title}
        releaseYear={releaseYear}
        janres={janres}
        voteAverage={voteAverage}
        posterPath={posterPath}
      />
    </TicketWrapper>
  );
};

export default TopMovieTicket;

const MovieRank = styled.p`
  font-size: 3rem;
`;
