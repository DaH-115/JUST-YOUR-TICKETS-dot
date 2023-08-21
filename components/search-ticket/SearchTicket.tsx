import styled from 'styled-components';
import Image from 'next/image';
import useGetGenres from 'hooks/useGetGenres';

import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import AdmitBtn from 'components/ticket/AdmitBtn';
import { MovieTicketProps } from 'ticketType';

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
    <SearchResultWrapper>
      <StyledInfo>
        <TicketIndex>{`${movieIndex + 1}.`}</TicketIndex>

        {/* GO TO MOVIE INFO PAGE BUTTON */}
        <MovieInfoBtn movieId={movieId} />
      </StyledInfo>
      <SearchResult>
        {/* POSTER BTN */}

        {posterImage && (
          <Image
            src={posterImage}
            alt={title}
            width={180}
            height={270}
            unoptimized
          />
        )}

        <MovieTextWrapper>
          <TicketTextDetail
            title={title}
            releaseYear={releaseYear}
            genres={genreArr}
            voteAverage={voteAverage}
          />
        </MovieTextWrapper>
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
      </SearchResult>
    </SearchResultWrapper>
  );
};

export default SearchTicket;

const SearchResultWrapper = styled.div`
  padding: 1rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    justify-content: center;
  }
`;

const SearchResult = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 650px;
`;

const StyledInfo = styled.div`
  display: flex;
  align-items: center;

  div {
    font-size: 1.5rem;
    color: #fff;
  }

  ${({ theme }) => theme.device.tablet} {
    display: block;
    margin-top: 1rem;
    margin-right: 1rem;
    align-items: baseline;
  }
`;

const TicketIndex = styled.p`
  font-weight: 700;
  font-size: 1.5rem;
  color: #fff;
  text-align: center;
  margin-right: 0.5rem;

  ${({ theme }) => theme.device.tablet} {
    margin-right: 0;
  }
`;

const MovieTextWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
