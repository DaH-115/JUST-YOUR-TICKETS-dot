import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillInfoCircle } from 'react-icons/ai';
import styled from 'styled-components';

const MovieInfoBtn = ({ movieId }: { movieId: number }) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname:
          router.pathname === '/'
            ? `/${movieId}`
            : `${router.pathname}/${movieId}`,
      }}
    >
      <StyeldInfoBtn>
        <AiFillInfoCircle />
      </StyeldInfoBtn>
    </Link>
  );
};

export default MovieInfoBtn;

const StyeldInfoBtn = styled.div`
  color: #fff;
  font-size: 2rem;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.8rem;
  }
`;
