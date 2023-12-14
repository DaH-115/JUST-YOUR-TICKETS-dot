import styled from 'styled-components';
import { TicketDetailsProps } from 'components/ticket/TicketDetails';
import JanreList from 'components/ticket/JanreList';
import JanreItem from 'components/ticket/JanreItem';

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

  padding: 0.6rem;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});

  border-radius: 0.5rem 0 0 0.5rem;
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const TicketHeader = styled.div`
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

const MovieTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;

const MovieRating = styled.p`
  display: flex;
  border-bottom: 0.1rem dashed ${({ theme }) => theme.colors.orange};
`;

const ReviewWrapper = styled.div`
  width: 100%;
  margin: 0.5rem 0 1rem;
`;

const ReviewText = styled.p``;
