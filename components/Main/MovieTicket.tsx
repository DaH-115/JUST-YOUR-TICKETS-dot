import { useRouter } from 'next/router';
import styled from 'styled-components';
import useGetJanres from '../hooks/useGetJanres';

import InfoButton from '../ticket/InfoButton';
import PosterImage from '../ticket/PosterImage';
import MovieTicketDetail from '../ticket/MovieTicketDetail';

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
      <MovieIndex routePath={router.pathname}>
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
      </MovieIndex>

      {/* 🎈 POSTER IMAGE Section */}
      <PosterImage title={props.title} posterPath={props.posterPath} />

      {/* 🎈 TICKET MOVIE DETAIL Section */}
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

const TicketWrapper = styled.div`
  width: 360px;
  margin-top: 2rem;
  margin-left: 0.5rem;
  margin-right: 1rem;
  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));

  ${({ theme }) => theme.device.desktop} {
    margin-top: 4rem;

    &:hover {
      transform: translateY(-2rem);
      transition: transform ease-in-out 250ms;
    }
  }
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
    ${({ theme }) => theme.colors.black} 30%,
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
