import Link from 'next/link';
import styled from 'styled-components';
import { AiFillInfoCircle } from 'react-icons/ai';

interface InfoProps {
  title: string;
  releaseYear: string;
  voteAverage: number | string;
  janre: string[];
  posterPath?: string;
  overview?: string;
}

const InfoButton = (props: InfoProps) => {
  return (
    <Link
      href={{
        pathname: `/search/${props.title}`,
        query: {
          title: props.title,
          releaseDate: props.releaseYear,
          posterImage: `https://image.tmdb.org/t/p/w500/${props.posterPath}`,
          voteAverage: props.voteAverage,
          janre: props.janre,
          overview: props.overview,
        },
      }}
      as={`/search/${props.title}`}
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
