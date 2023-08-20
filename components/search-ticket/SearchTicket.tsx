import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import useGetGenres from 'hooks/useGetGenres';

import MovieInfoBtn from 'components/ticket/MovieInfoBtn';
import TicketTextDetail from 'components/ticket/TicketTextDetail';
import { MovieTicketProps } from 'ticketType';
import { MdOutlineArrowForwardIos } from 'react-icons/md';

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
        <MovieTextWrapper>
          <TicketTextDetail
            title={title}
            releaseYear={releaseYear}
            genres={genreArr}
            voteAverage={voteAverage}
          />
        </MovieTextWrapper>

        {/* POSTER BTN */}
        <Link
          href={{
            pathname: '/write',
            query: {
              title,
              releaseYear,
              posterImage,
            },
          }}
          as={`/write`}
        >
          <PosterBtn>
            {posterImage ? (
              <Image
                src={posterImage}
                alt={title}
                width={180}
                height={270}
                unoptimized
              />
            ) : (
              <NoneImgTitle>{title}</NoneImgTitle>
            )}

            <PosterBtnText>
              {'ADMIT ONE'}
              <MdOutlineArrowForwardIos />
            </PosterBtnText>
          </PosterBtn>
        </Link>
      </SearchResult>
    </SearchResultWrapper>
  );
};

export default SearchTicket;

const NoneImgTitle = styled.div`
  width: 180px;
  height: 270px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
  padding-top: 1rem;
`;

const PosterBtn = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.9));
`;

const PosterBtnText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  padding: 1rem;
  padding-top: 0.8rem;
  background-color: ${({ theme }) => theme.colors.black};
  border-top: 0.1rem dashed ${({ theme }) => theme.colors.orange};

  svg {
    font-size: 1rem;
    margin-left: 0.3rem;
  }

  &:hover,
  &:active {
    svg {
      color: ${({ theme }) => theme.colors.orange};
      transition: color 150ms ease-in-out;
    }
  }
`;

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
  margin-top: 1rem;
`;
