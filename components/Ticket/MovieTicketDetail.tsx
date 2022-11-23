import Link from 'next/link';
import styled from 'styled-components';
import MovieTextDetail from './MovieTextDetail';
import { AiOutlineArrowRight } from 'react-icons/ai';

interface TicketDetailProps {
  title: string;
  voteAverage: number | string;
  releaseYear: string;
  posterPath?: string;
  reviewText?: string;
  janre?: string[];
}

const MovieTicketDetail = ({
  title,
  voteAverage,
  releaseYear,
  posterPath,
  reviewText,
  janre,
}: TicketDetailProps) => {
  return (
    <MovieDetailWrapper>
      <MovieTextDetail
        title={title}
        releaseYear={releaseYear}
        rating={voteAverage}
        reviewText={reviewText}
        janre={janre}
      />

      {/* 🎈 GO TO "/write" PAGE BUTTON */}
      {!reviewText && (
        <Link
          href={{
            pathname: '/write',
            query: {
              title: title,
              releaseYear: releaseYear,
              posterImage: `https://image.tmdb.org/t/p/w500/${posterPath}`,
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
    </MovieDetailWrapper>
  );
};

export default MovieTicketDetail;

const MovieDetailWrapper = styled.div`
  position: relative;
  bottom: 3rem;
  left: 0;
  display: flex;
  width: 100%;
  height: 10rem;
  color: ${({ theme }) => theme.colors.black};
  filter: drop-shadow(0px 0px 40px rgba(50, 50, 50, 0.9));
`;

const AdmitButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.orange};
  border-top-left-radius: 1rem;
  border-bottom-right-radius: 1.5rem;

  button {
    font-weight: 700;
  }
`;

const ArrowBtn = styled.div`
  width: 2rem;
  height: 2rem;
  text-align: center;
  margin-top: 8px;
`;
