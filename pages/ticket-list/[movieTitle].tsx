import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import Head from 'next/head';
import BackgroundStyle from '../../components/layout/BackgroundStyle';
import LoadingMsg from '../../components/common/LoadingMsg';
import { SlideTitle } from '../../components/styles/StyledTitle';
import { QueryData } from 'ticketType';
import PosterImage from '../../components/ticket/PosterImage';

const UserTicketDetailPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { title, releaseYear, rating, posterImage, reviewText } =
    router.query as unknown as QueryData;
  const titleText = `JUST MY TICKETS. | ${title}`;

  useEffect(() => {
    setIsLoading(true);
    if (router.query.title === undefined) {
      router.push('/ticket-list');
      return;
    }
    setIsLoading(false);
  }, []);

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <BackgroundStyle backgroundColor='black' customMessage='info✔️'>
        <SlideTitle>{'영화 상세 정보'}</SlideTitle>
        {isLoading ? (
          <LoadingMsg />
        ) : (
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
                <StyledLabeling>{'* Rating /나의 점수'}</StyledLabeling>
                <ContentText>
                  <p>{`${Math.round(+rating)} /10`}</p>
                </ContentText>

                <StyledLabeling>{'* Review /나의 감상'}</StyledLabeling>
                <ContentText>
                  <OverviweText>{reviewText}</OverviweText>
                </ContentText>
              </DetailTextWrapper>
            </MovieDetails>
          </DetailWrapper>
        )}
      </BackgroundStyle>
    </>
  );
};

export default UserTicketDetailPage;

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

  ${({ theme }) => theme.device.desktop} {
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

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  padding-bottom: 2rem;
`;
