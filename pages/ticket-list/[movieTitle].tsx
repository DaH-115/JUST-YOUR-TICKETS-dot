import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
import { QueryData } from 'ticketType';

const UserTicketDetailPage = () => {
  const router = useRouter();
  const { title, releaseYear, rating, posterImage, reviewText } =
    router.query as unknown as QueryData;
  const titleText = `JUST MY TICKETS. | ${title}`;

  useEffect(() => {
    if (router.query.title === undefined) {
      router.push('/ticket-list');
    }
  }, []);

  return (
    <>
      <Head>
        <title>{titleText}</title>
      </Head>
      <BackgroundStyle customMessage='info✔️'>
        <SlideTitle>{'영화 상세 정보'}</SlideTitle>
        <MovieDetailWrapper>
          <PosterImage
            title={title}
            releaseYear={releaseYear}
            posterImage={posterImage}
          />
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
        </MovieDetailWrapper>
      </BackgroundStyle>
    </>
  );
};

export default UserTicketDetailPage;
