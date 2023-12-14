import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import withHead from 'components/common/withHead';
import PosterImage from 'components/ticket/PosterImage';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserTicketDetails } from 'store/userTicketSlice';
import { UserTicketDetailsProps } from 'ticketType';
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

const UserTicketDetailPage = () => {
  const router = useRouter();
  const { ticketId } = router.query as { ticketId: string };
  const dispatch = useAppDispatch();
  const userTicketDetails = useAppSelector(
    (state) => state.userTicket.userTicketDetails
  );
  const { title, releaseYear, posterImage, rating, reviewText } =
    userTicketDetails as UserTicketDetailsProps;

  useEffect(() => {
    if (ticketId) {
      dispatch(getUserTicketDetails(ticketId));
    } else {
      router.push('/ticket-list');
    }
  }, [ticketId]);

  return (
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
            <RatingNumber>{`${rating} /10`}</RatingNumber>
          </ContentText>
          <StyledLabel>{'Review /나의 감상'}</StyledLabel>
          <ContentText>
            <OverviweText>{reviewText}</OverviweText>
          </ContentText>
        </DetailTextWrapper>
      </MovieDetailWrapper>
    </BackgroundStyle>
  );
};

export default withHead(UserTicketDetailPage, '나의 티켓');

const BackgroundStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;
