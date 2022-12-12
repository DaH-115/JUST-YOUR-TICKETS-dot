import Link from 'next/link';
import { useRouter } from 'next/router';

import { AiFillInfoCircle } from 'react-icons/ai';
import { StyeldInfo } from '../styles/StyeldInfo';

const MovieInfoButton = ({ movieId }: { movieId: number }) => {
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
      <StyeldInfo>
        <AiFillInfoCircle />
      </StyeldInfo>
    </Link>
  );
};

export default MovieInfoButton;
