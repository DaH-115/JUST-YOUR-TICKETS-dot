import styled from 'styled-components';
import useGetJanres from '../../hooks/useGetJanres';

import AdmitBtn from '../ticket/AdmitBtn';
import InfoButton from '../ticket/InfoButton';
import MovieTextDetail from '../ticket/MovieTextDetail';
import { MovieTicketProps } from 'ticketType';

const SearchTicketList = ({
  title,
  releaseDate,
  movieId,
  movieIndex,
  voteAverage,
  posterPath,
  overview,
}: MovieTicketProps) => {
  const janres = useGetJanres(movieId);
  const releaseYear = releaseDate.slice(0, 4);

  return (
    <SearchResultWrapper>
      <SearchResult>
        <StyledInfo>
          <TicketIndex>{movieIndex + 1}.</TicketIndex>

          {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
          <InfoButton
            movieId={movieId}
            title={title}
            releaseYear={releaseYear}
            janres={janres}
            voteAverage={voteAverage}
            overview={overview}
            posterPath={posterPath}
          />
        </StyledInfo>
        <MovieTextDetail
          title={title}
          releaseYear={releaseYear}
          janres={janres}
          voteAverage={voteAverage}
        />
        <AdmitBtn
          title={title}
          releaseYear={releaseYear}
          posterPath={posterPath}
        />
      </SearchResult>
    </SearchResultWrapper>
  );
};

export default SearchTicketList;

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
  padding: 0rem 1rem;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
`;

const StyledInfo = styled.div`
  margin-right: 0.5rem;
  div {
    font-size: 1.2rem;
    color: #fff;
  }
`;

const TicketIndex = styled.p`
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
  margin-bottom: 0.4rem;
`;
