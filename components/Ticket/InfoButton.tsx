import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { AiFillInfoCircle } from 'react-icons/ai';
import { MovieInfoProps } from 'ticketType';

const InfoButton = (props: MovieInfoProps) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname:
          router.pathname === '/'
            ? `/${props.title}`
            : `${router.pathname}/${props.title}`,
        query: {
          title: props.title,
          releaseYear: props.releaseYear,
          posterImage: `https://image.tmdb.org/t/p/w500/${props.posterPath}`,
          voteAverage: props.voteAverage,
          janre: props.janre,
          overview: props.overview,
        },
      }}
      as={
        router.pathname === '/'
          ? `/${props.title}`
          : `${router.pathname}/${props.title}`
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
