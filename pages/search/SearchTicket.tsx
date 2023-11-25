import styled from 'styled-components';
import Image from 'next/image';
import { useAppSelector } from 'store/hooks';
import useGetGenres from 'hooks/useGetGenres';
import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';
import { MovieDataProps } from 'ticketType';

interface SearchTicketProps {
  movieId: number;
  movieIndex: number;
}

const SearchTicket = ({ movieId, movieIndex }: SearchTicketProps) => {
  const movieData = useAppSelector((state) => state.movieData.movieList);
  const filteredMovieData = movieData.filter(
    (item: MovieDataProps) => item.id === movieId
  );
  const moviePoster = filteredMovieData[0]?.poster_path || undefined;
  const movieTitle = filteredMovieData[0]?.title || '제목없음';
  const movieDate = filteredMovieData[0]?.release_date || '없음';
  const movieVote = filteredMovieData[0]?.vote_average || 0;
  const genreArr = useGetGenres(movieId);

  return (
    <SearchTicketWrapper>
      <MovieIndexBar>
        <TicketIndex>{`${movieIndex}.`}</TicketIndex>
        <MovieInfoBtn movieId={movieId} />
      </MovieIndexBar>

      <PosterImageWrapper>
        {moviePoster ? (
          <PosterImage>
            <Image
              src={moviePoster}
              alt={movieTitle}
              width={180}
              height={270}
              unoptimized
            />
          </PosterImage>
        ) : (
          <PosterImage>{`${movieTitle}(${movieDate})`}</PosterImage>
        )}
      </PosterImageWrapper>

      <TicketDetailWrapper>
        <TicketTextDetail
          title={movieTitle}
          releaseYear={movieDate}
          voteAverage={movieVote}
          genres={genreArr}
        />
        <AdmitBtn movieId={movieId} />
      </TicketDetailWrapper>
    </SearchTicketWrapper>
  );
};

export default SearchTicket;

const SearchTicketWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  margin-bottom: 1rem;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    justify-content: center;
  }
`;

const PosterImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    margin-bottom: 0;
    margin: 0 1rem;
  }
`;

const PosterImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 180px;
  height: 270px;

  color: #fff;
  background-color: ${({ theme }) => theme.colors.black};
`;

const TicketDetailWrapper = styled.div`
  display: flex;
  justify-content: center;

  width: 100%;
  height: 100%;
  max-width: ${({ theme }) => theme.size.mobile};
`;

const MovieIndexBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 1.5rem;
  color: #fff;

  ${({ theme }) => theme.device.tablet} {
    display: block;
  }
`;

const TicketIndex = styled.p`
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.8rem;
  }
`;
