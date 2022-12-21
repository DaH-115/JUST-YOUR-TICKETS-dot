import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import useGetJanres from '../hooks/useGetJanres';
import { AiOutlineArrowRight } from 'react-icons/ai';

import BackgroundStyle from '../layout/BackgroundStyle';
import PosterImage from '../ticket/PosterImage';
import { SlideTitle } from '../styles/StyledTitle';
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
    ? `https://image.tmdb.org/t/p/w500/${posterPath}`
    : '';
  const titleText = `JUST MY TICKETS. | ${title}`;

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <BackgroundStyle customMessage='info✔️'>
        <SlideTitle>{'영화 상세 정보'}</SlideTitle>
        <DetailWrapper>
          <MovieDetails>
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
                <AdmitButtonWrapper>
                  <button>{'ADMIT ONE'}</button>
                  <ArrowBtn>
                    <AiOutlineArrowRight />
                  </ArrowBtn>
                </AdmitButtonWrapper>
              </Link>
            </DetailTextWrapper>
          </MovieDetails>
        </DetailWrapper>
      </BackgroundStyle>
    </>
  );
};

export default React.memo(MovieDetail);

const DetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 4rem;

  ${({ theme }) => theme.device.tablet} {
    margin-bottom: 4rem;
  }
`;

const MovieDetails = styled.div`
  width: 100%;
  height: 100%;
  max-width: 600px;

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;
    background-color: ${({ theme }) => theme.colors.black};
  }
`;

const DetailTextWrapper = styled.div`
  position: relative;
  bottom: 1.2rem;
  left: 0;

  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  background: linear-gradient(white 70%, ${({ theme }) => theme.colors.yellow});

  ${({ theme }) => theme.device.tablet} {
    bottom: 0;

    max-width: 600px;
    padding: 1.2rem 1rem;
    margin-left: 2rem;
  }
`;

const StyledLabeling = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;

  &:first-child {
    margin-bottom: 0.6rem;
  }
`;

const ContentText = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  h1 {
    font-weight: 700;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.orange};
    padding-bottom: 0.5rem;
  }
`;

const MovieJanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  font-size: 1rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

    &::before {
      content: '/';
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  padding-bottom: 2rem;
`;

const AdmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1rem;

  &:active {
    button {
      color: ${({ theme }) => theme.colors.yellow};
    }

    div {
      color: ${({ theme }) => theme.colors.yellow};
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
