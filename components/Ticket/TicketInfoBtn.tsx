import Link from 'next/link';
import { useRouter } from 'next/router';

import { AiFillInfoCircle } from 'react-icons/ai';
import { TicketInfoProps } from 'ticketType';
import { StyeldInfo } from '../styles/StyeldInfo';

const TicketInfoButton = ({
  title,
  releaseYear,
  posterImage,
  rating,
  reviewText,
}: TicketInfoProps) => {
  const router = useRouter();

  return (
    <Link
      href={{
        pathname: `${router.pathname}/${title}`,
        query: {
          title,
          releaseYear,
          posterImage,
          rating,
          reviewText,
        },
      }}
      as={`${router.pathname}/${title}`}
    >
      <StyeldInfo>
        <AiFillInfoCircle />
      </StyeldInfo>
    </Link>
  );
};

export default TicketInfoButton;
