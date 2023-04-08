import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetGenres from 'hooks/useGetGenres';

import PosterImage from 'components/ticket/PosterImage';
import MovieTicketDetail from 'components/ticket/MovieTicketDetail';
import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketWrapper from 'components/styles/TicketWrapper';
import MovieIndexBar from 'components/styles/MovieIndexBar';
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
  const genreArr = useGetGenres(movieId);
  const releaseYear = releaseDate.slice(0, 4);

  return (
    <TicketWrapper>
      {/* TICKET INDEX HEADER */}
      <MovieIndexBar routePath={router.pathname}>
        <MovieRank>{`*${movieIndex}`}</MovieRank>

        {/* GO TO MOVIE INFO PAGE BUTTON */}
        <MovieInfoBtn movieId={movieId} />
      </MovieIndexBar>

      {/* POSTER IMAGE */}
      <PosterImage title={title} posterPath={posterPath} />

      {/* TICKET DETAIL */}
      <MovieTicketDetail
        title={title}
        releaseYear={releaseYear}
        genres={genreArr}
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
