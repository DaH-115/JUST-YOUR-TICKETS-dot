import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { AiOutlineArrowRight } from 'react-icons/ai';

import BackgroundStyle from '../layout/BackgroundStyle';
import LoadingMsg from '../common/LoadingMsg';
import { SlideTitle } from '../styles/StyledTitle';

const MovieDetailPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { title, releaseYear, posterImage, voteAverage, overview } =
    router.query;
  const janreArr = router.query.janre as string[];
  const fromTicketList = router.pathname.includes('ticket-list');

  useEffect(() => {
    setIsLoading(true);
    if (router.query.title === undefined) {
      router.push('/');
      return;
    }
    setIsLoading(false);
  }, []);

  return (
    <BackgroundStyle backgroundColor='black' customMessage='info✔️'>
      <SlideTitle>영화 상세 정보</SlideTitle>
      {isLoading ? (
        <LoadingMsg />
      ) : (
        <DetailWrapper>
          <MovieDetails>
            {!posterImage ? (
              <ImgBox>
                <NoneImg>IMAGE IS NONE</NoneImg>
              </ImgBox>
            ) : (
              <ImgBox>
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${posterImage}`}
                  alt={`${title} Image Poster`}
                  width={360}
                  height={560}
                />
              </ImgBox>
            )}
            <TextWrapper>
              <StyledLabeling>* Movie Title /제목</StyledLabeling>
              <ContentText>
                <h1>
                  {title}({releaseYear})
                </h1>
              </ContentText>
              <StyledLabeling>
                {fromTicketList ? `* Rating /나의 점수` : '* Rating /점수'}
              </StyledLabeling>
              <ContentText>
                <p>{voteAverage} /10</p>
              </ContentText>
              {janreArr && (
                <>
                  <StyledLabeling>* Janres /장르</StyledLabeling>
                  <ContentText>
                    <MovieJanreWrapper>
                      {janreArr.map((item, index) => (
                        <li key={index}>/ {item}</li>
                      ))}
                    </MovieJanreWrapper>
                  </ContentText>
                </>
              )}

              <StyledLabeling>
                {fromTicketList ? `* Review /나의 감상` : '* Overview /줄거리'}
              </StyledLabeling>
              <ContentText>
                <OverviweText>{overview}</OverviweText>
              </ContentText>

              {fromTicketList ? null : (
                <Link
                  href={{
                    pathname: '/write',
                    query: {
                      title,
                      releaseYear,
                      posterImage: `https://image.tmdb.org/t/p/w500/${posterImage}`,
                    },
                  }}
                  as={`/write`}
                >
                  <AdmitButtonWrapper>
                    <button>ADMIT ONE</button>
                    <ArrowBtn>
                      <AiOutlineArrowRight />
                    </ArrowBtn>
                  </AdmitButtonWrapper>
                </Link>
              )}
            </TextWrapper>
          </MovieDetails>
        </DetailWrapper>
      )}
    </BackgroundStyle>
  );
};

export default MovieDetailPage;

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
