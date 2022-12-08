import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { AiOutlineArrowRight } from 'react-icons/ai';

import Head from 'next/head';
import BackgroundStyle from '../layout/BackgroundStyle';
import { SlideTitle } from '../styles/StyledTitle';
import useGetJanres from '../hooks/useGetJanres';
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
  const posterImage = `https://image.tmdb.org/t/p/w500/${posterPath}`;
  const titleText = `JUST MY TICKETS. | ${title}`;

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <BackgroundStyle backgroundColor='black' customMessage='info✔️'>
        <SlideTitle>{'영화 상세 정보'}</SlideTitle>
        <DetailWrapper>
          <MovieDetails>
            {!posterImage ? (
              <ImgBox>
                <NoneImg>{'IMAGE IS NONE'}</NoneImg>
              </ImgBox>
            ) : (
              <ImgBox>
                <Image
                  src={posterImage}
                  alt={`${title} Image Poster`}
                  width={360}
                  height={560}
                />
              </ImgBox>
            )}
            <TextWrapper>
              <StyledLabeling>{'* Movie Title /제목'}</StyledLabeling>
              <ContentText>
                <h1>
                  {title}({releaseYear})
                </h1>
              </ContentText>
              <StyledLabeling>{'* Rating /점수'}</StyledLabeling>
              <ContentText>
                <p>{Math.round(voteAverage)} /10</p>
              </ContentText>
              {janreArr && (
                <>
                  <StyledLabeling>{'* Janres /장르'}</StyledLabeling>
                  <ContentText>
                    <MovieJanreWrapper>
                      {janreArr.map((item, index) => (
                        <li key={index}>/ {item}</li>
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
            </TextWrapper>
          </MovieDetails>
        </DetailWrapper>
      </BackgroundStyle>
    </>
  );
};

export default MovieDetail;

const DetailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 2rem;

  ${({ theme }) => theme.device.desktop} {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;

    padding: 0 2rem;
    padding-bottom: 4rem;
  }
`;

const MovieDetails = styled.div`
  width: 100%;
  height: 100%;
  max-width: 600px;

  ${({ theme }) => theme.device.desktop} {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 100%;

    background-color: ${({ theme }) => theme.colors.black};
  }
`;

const TextWrapper = styled.div`
  position: relative;
  bottom: 0.8rem;
  left: 0;

  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.5rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(white 70%, ${({ theme }) => theme.colors.yellow});

  ${({ theme }) => theme.device.desktop} {
    max-width: 600px;
    padding: 1.2rem 1rem;
    margin-left: 2rem;
  }
`;

const ImgBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0px 0px 50px rgba(255, 255, 255, 0.4));

  Img {
    width: 100%;
    max-width: 400px;
  }
`;

const NoneImg = styled.div`
  width: 360px;
  height: 560px;
  font-weight: 700;
  color: black;
  background-color: ${({ theme }) => theme.colors.orange};
  text-align: center;
  padding-top: 2rem;
`;

const StyledLabeling = styled.p`
  font-size: 0.8rem;
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

    &:last-child {
      margin-right: 0;
    }
  }
`;

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  line-height: 1.2rem;
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
