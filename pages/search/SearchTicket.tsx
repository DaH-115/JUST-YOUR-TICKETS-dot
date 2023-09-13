import styled from 'styled-components';
import Image from 'next/image';
import useGetGenres from 'hooks/useGetGenres';
import { MovieTicketProps } from 'ticketType';
import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';

const SearchTicket = ({
  title,
  releaseDate,
  movieId,
  movieIndex,
  voteAverage,
  posterPath,
}: MovieTicketProps) => {
  const genreArr = useGetGenres(movieId);
  const releaseYear = releaseDate && releaseDate.slice(0, 4);
  const posterImage = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : undefined;

  return (
    <SearchTicketWrapper>
      <MovieIndexBar>
        <TicketIndex>{`${movieIndex}.`}</TicketIndex>
        <MovieInfoBtn movieId={movieId} />
      </MovieIndexBar>

      <PosterImageWrapper>
        {posterImage ? (
          <PosterImage>
            <Image
              src={posterImage}
              alt={title}
              width={180}
              height={270}
              unoptimized
            />
          </PosterImage>
        ) : (
          <PosterImage>{`${title}(${releaseYear})`}</PosterImage>
        )}
      </PosterImageWrapper>

      <TicketDetailWrapper>
        <TicketTextDetail
          title={title}
          releaseYear={releaseYear}
          voteAverage={voteAverage}
          genres={genreArr}
        />
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
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
