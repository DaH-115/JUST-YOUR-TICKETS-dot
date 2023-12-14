import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';
import useGetGenres from 'hooks/useGetGenres';
import { MovieDetailProps } from 'ticketType';
import PosterImage from 'components/ticket/PosterImage';
import {
  ContentText,
  DetailTextWrapper,
  MovieDetailWrapper,
  MovieTitle,
  OverviweText,
  PageTitle,
  RatingNumber,
  StyledLabel,
} from 'components/movie-detail';
import JanreList from 'components/ticket/JanreList';
import JanreItem from 'components/ticket/JanreItem';

const MovieDetail = ({
  movieId,
  title,
  releaseDate,
  voteAverage,
  overview,
  posterPath,
}: MovieDetailProps) => {
  const genreArr = useGetGenres(movieId);
  const releaseYear = releaseDate.slice(0, 4);
  const posterImage = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : undefined;

  return (
    <BackgroundStyle>
      <PageTitle>{'영화 상세 정보'}</PageTitle>
      <MovieDetailWrapper>
        <PosterImage
          title={title}
          releaseYear={releaseYear}
          posterImage={posterImage}
        />

        <DetailTextWrapper>
          <StyledLabel>{'Movie Title /제목'}</StyledLabel>
          <ContentText>
            <MovieTitle>
              {title}({releaseYear})
            </MovieTitle>
          </ContentText>
          <StyledLabel>{'Rating /점수'}</StyledLabel>
          <ContentText>
            <RatingNumber>{`${Math.round(voteAverage)} /10`}</RatingNumber>
          </ContentText>
          <StyledLabel>{'Genre /장르'}</StyledLabel>
          {genreArr && (
            <ContentText>
              <JanreList>
                {genreArr.map((item, index) => (
                  <JanreItem key={index}>{item}</JanreItem>
                ))}
              </JanreList>
            </ContentText>
          )}

          <StyledLabel>{'Overview /줄거리'}</StyledLabel>
          <ContentText>
            <OverviweText>
              {!overview ? '등록된 줄거리가 없습니다.' : overview}
            </OverviweText>
          </ContentText>

          <Link
            href={{
              pathname: '/write',
              query: {
                movieId,
              },
            }}
            as={`/write`}
          >
            <AdmitBtnWrapper>
              <AdmitBtn>{'ADMIT ONE'}</AdmitBtn>
              <ArrowBtn>
                <AiOutlineArrowRight />
              </ArrowBtn>
            </AdmitBtnWrapper>
          </Link>
        </DetailTextWrapper>
      </MovieDetailWrapper>
    </BackgroundStyle>
  );
};

export default React.memo(MovieDetail);

const BackgroundStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const AdmitBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.black};
  border-radius: 1rem;
  padding: 1rem;
  margin-top: 1rem;

  &:hover,
  &:active {
    button,
    div {
      color: ${({ theme }) => theme.colors.orange};
      transition: color ease-in-out 200ms;
    }
  }
`;

const AdmitBtn = styled.button`
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
`;

const ArrowBtn = styled.div`
  color: #fff;
  margin-left: 0.5rem;
`;
