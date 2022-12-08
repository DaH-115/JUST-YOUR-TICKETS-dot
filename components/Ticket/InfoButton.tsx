import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { AiFillInfoCircle } from 'react-icons/ai';
import { MovieInfoProps } from 'ticketType';

const InfoButton = ({
  movieId,
  title,
  releaseYear,
  posterPath,
  voteAverage,
  janres,
  overview,
}: MovieInfoProps) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname:
          router.pathname === '/'
            ? `/${movieId}`
            : router.pathname === '/ticket-list'
            ? `${router.pathname}/${title}`
            : `${router.pathname}/${movieId}`,
        query: {
          title,
          releaseYear,
          posterImage: `https://image.tmdb.org/t/p/w500/${posterPath}`,
          voteAverage,
          janres,
          overview,
        },
      }}
      as={
        router.pathname === '/'
          ? `/${movieId}`
          : router.pathname === '/ticket-list'
          ? `${router.pathname}/${title}`
          : `${router.pathname}/${movieId}`
      }
    >
      <StyeldInfo>
        <AiFillInfoCircle />
      </StyeldInfo>
    </Link>
  );
};

export default InfoButton;

const StyeldInfo = styled.div`
  font-size: 1.8rem;
  color: #fff;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
  }
`;
