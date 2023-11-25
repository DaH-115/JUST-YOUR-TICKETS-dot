import styled from 'styled-components';
import { TicketDetailsProps } from 'components/ticket/TicketDetails';

const TicketTextDetail = ({
  title,
  releaseYear,
  voteAverage,
  genres,
  reviewText,
}: TicketDetailsProps) => {
  return (
    <TicketTextWrapper>
      <TicketHeader>
        <MovieTitle>
          {title} ({releaseYear})
        </MovieTitle>
        <MovieRating>{`${Math.round(voteAverage)} /10`}</MovieRating>
      </TicketHeader>

      {genres && (
        <JanreList>
          {genres.map((genre, index) => (
            <JanreItem key={index}>
              {genre === 'Science Fiction' ? 'SF' : genre}
            </JanreItem>
          ))}
        </JanreList>
      )}

      {reviewText && (
        <ReviewWrapper>
          <ReviewText>{reviewText}</ReviewText>
        </ReviewWrapper>
      )}
    </TicketTextWrapper>
  );
};

export default TicketTextDetail;

const TicketTextWrapper = styled.div`
  width: 100%;
  height: 8.5rem;

  padding: 0.5rem;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});

  border-left: 0.5rem dotted ${({ theme }) => theme.colors.black};
  border-radius: 0.2rem 0 0 0.2rem;
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  ${({ theme }) => theme.device.tablet} {
    border-left: 0.3rem dotted ${({ theme }) => theme.colors.black};
  }
`;

const TicketHeader = styled.div`
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const MovieTitle = styled.h1`
  font-weight: 700;
`;

const MovieRating = styled.p`
  display: flex;
  font-weight: 700;
  border-bottom: 0.1rem dashed ${({ theme }) => theme.colors.orange};
`;

const JanreList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const JanreItem = styled.li`
  margin-right: 0.2rem;

  &:not(:first-child)::before {
    content: '/';
  }

  &:last-child {
    margin-right: 0;
  }
`;

const ReviewWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0 1rem;
`;

const ReviewText = styled.p``;
