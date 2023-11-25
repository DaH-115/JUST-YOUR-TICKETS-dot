import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';
import useGetGenres from 'hooks/useGetGenres';
import { MovieDetailProps } from 'ticketType';
import PosterImage from 'components/ticket/PosterImage';

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
  const titleText = `JUST MY TICKETS. | ${title}`;

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>

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
                <JanreWrapper>
                  {genreArr.map((item, index) => (
                    <JanreItem key={index}>{item}</JanreItem>
                  ))}
                </JanreWrapper>
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
    </>
  );
};

export default React.memo(MovieDetail);

const BackgroundStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2rem;
    margin-left: 2rem;
  }
`;

const MovieDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 2rem 0 0;
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  ${({ theme }) => theme.device.tablet} {
    flex-direction: row;
    padding: 2rem;
    padding-bottom: 0;
  }
`;

const DetailTextWrapper = styled.div`
  width: 100%;
  padding: 2rem 1rem;
  margin-top: 1rem;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});

  border-top-right-radius: 0.9rem;
  border-top-left-radius: 0.9rem;
  border-top: 0.7rem dotted ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.device.tablet} {
    max-width: ${({ theme }) => theme.size.tablet};
    padding: 2.5rem 3rem;
    padding-bottom: 1.5rem;
    margin-left: 1rem;

    border-top-right-radius: 0.9rem;
    border-top-left-radius: 0.9rem;
    border-top: 0.7rem dotted ${({ theme }) => theme.colors.black};
  }
`;

const StyledLabel = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const ContentText = styled.div`
  width: 100%;
  font-size: 1.2rem;
`;

const MovieTitle = styled.h1`
  font-weight: 700;
  border-bottom: 0.15rem dashed ${({ theme }) => theme.colors.orange};
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding-bottom: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;

const RatingNumber = styled.p`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const JanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 2rem;
  font-size: 1rem;
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const JanreItem = styled.li`
  margin-right: 0.4rem;

  &:not(:first-child)::before {
    content: '/';
  }

  &:last-child {
    margin-right: 0;
  }
`;

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  padding-bottom: 2rem;
  border-bottom: 0.15rem dashed ${({ theme }) => theme.colors.orange};

  ${({ theme }) => theme.device.tablet} {
    font-size: 0.9rem;
  }
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
