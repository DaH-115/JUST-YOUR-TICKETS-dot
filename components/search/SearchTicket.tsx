import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';
import useGetJanres from '../../hooks/useGetJanres';

import MovieInfoBtn from '../ticket/MovieInfoBtn';
import MovieTextDetail from '../ticket/MovieTextDetail';
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
  const janres = useGetJanres(movieId);
  const releaseYear = releaseDate && releaseDate.slice(0, 4);
  const posterImage =
    posterPath && `https://image.tmdb.org/t/p/w500/${posterPath}`;

  return (
    <SearchResultWrapper>
      <SearchResult>
        <StyledInfo>
          <TicketIndex>{movieIndex + 1}.</TicketIndex>

          {/* GO TO MOVIE INFO PAGE BUTTON */}
          <MovieInfoBtn movieId={movieId} />
        </StyledInfo>
        <MovieTextDetail
          title={title}
          releaseYear={releaseYear}
          janres={janres}
          voteAverage={voteAverage}
        />

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
              <Image src={posterImage} alt={title} width={180} height={270} />
            ) : (
              <NoneImg>IMAGE IS NONE</NoneImg>
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

const NoneImg = styled.div`
  width: 170px;
  height: 270px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
`;

const PosterBtn = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  border-bottom: 0.1rem solid ${({ theme }) => theme.colors.orange};
`;

const PosterBtnText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
  padding: 0.5rem;
`;

const SearchResultWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.black};
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const SearchResult = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 600px;
  padding: 2rem 1rem;
  padding-left: 0.5rem;

  filter: drop-shadow(60px 50px 50px rgba(0, 0, 0, 0.9));
`;

const StyledInfo = styled.div`
  margin-right: 0.5rem;
  div {
    font-size: 1.2rem;
    color: #fff;
  }
`;

const TicketIndex = styled.p`
  color: #fff;
  text-align: center;
  margin-bottom: 0.4rem;
`;
