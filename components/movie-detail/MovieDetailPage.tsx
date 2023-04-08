import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';
import useGetJanres from 'hooks/useGetJanres';

import BackgroundStyle from 'components/layout/BackgroundStyle';
import PosterImage from 'components/ticket/PosterImage';
import {
  ContentText,
  DetailTextWrapper,
  MovieDetailWrapper,
  OverviweText,
  StyledLabeling,
} from 'components/styles/movie-details';
import SlideTitle from 'components/styles/StyledTitle';
import MovieJanreWrapper from 'components/styles/MovieJanreWrapper';
import { MovieDataProps } from 'ticketType';

const MovieDetail = ({
  movieId,
  title,
  releaseDate,
  voteAverage,
  overview,
  posterPath,
}: MovieDataProps) => {
  const janreArr = useGetJanres(movieId);
  const releaseYear = releaseDate.slice(0, 4);
  const posterImage = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : '';
  const titleText = `JUST MY TICKETS. | ${title}`;

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <BackgroundStyle customMessage='info✔️'>
        <SlideTitle>{'영화 상세 정보'}</SlideTitle>
        <MovieDetailWrapper>
          <PosterImage title={title} posterImage={posterImage} />
          <DetailTextWrapper>
            <StyledLabeling>{'* Movie Title /제목'}</StyledLabeling>
            <ContentText>
              <h1>
                {title}({releaseYear})
              </h1>
            </ContentText>
            <StyledLabeling>{'* Rating /점수'}</StyledLabeling>
            <ContentText>
              <p>{`${Math.round(voteAverage)} /10`}</p>
            </ContentText>
            {janreArr && (
              <>
                <StyledLabeling>{'* Janres /장르'}</StyledLabeling>
                <ContentText>
                  <MovieJanreWrapper>
                    {janreArr.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </MovieJanreWrapper>
                </ContentText>
              </>
            )}

            <StyledLabeling>{'* Overview /줄거리'}</StyledLabeling>
            <ContentText>
              <OverviweText>
                {!overview ? '등록된 줄거리가 없습니다.' : overview}
              </OverviweText>
            </ContentText>

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
              <AdmitBtnWrapper>
                <button>{'ADMIT ONE'}</button>
                <ArrowBtn>
                  <AiOutlineArrowRight />
                </ArrowBtn>
              </AdmitBtnWrapper>
            </Link>
          </DetailTextWrapper>
        </MovieDetailWrapper>
      </BackgroundStyle>
    </>
  );
};

export default React.memo(MovieDetail);

const AdmitBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1rem;

  &:hover,
  &:active {
    button {
      color: ${({ theme }) => theme.colors.yellow};
      transition: color 200ms ease-in-out;
    }

    div {
      color: ${({ theme }) => theme.colors.yellow};
      transition: color 200ms ease-in-out;
    }
  }

  button {
    color: ${({ theme }) => theme.colors.black};
    font-size: 1rem;
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  margin-left: 0.5rem;
  color: ${({ theme }) => theme.colors.black};
`;
