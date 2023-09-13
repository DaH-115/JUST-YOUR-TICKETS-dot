import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PosterImage from 'components/ticket/PosterImage';
import { QueryData } from 'ticketType';
import styled from 'styled-components';

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

      <BackgroundStyle>
        <PageTitle>{'나의 티켓'}</PageTitle>
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
            <StyledLabel>{'Rating /나의 점수'}</StyledLabel>
            <ContentText>
              <p>{`${Math.round(+rating)} /10`}</p>
            </ContentText>

            <StyledLabel>{'Review /나의 감상'}</StyledLabel>
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

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  padding-bottom: 2rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 0.9rem;
  }
`;
