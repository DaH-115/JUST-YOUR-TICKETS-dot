import { NextPage } from 'next';
import { useRouter } from 'next/router';

import WriteForm from '../../components/WriteForm';

interface WriteFormProps {
  ticketId: string;
  releaseYear: string;
  title: string;
  rating: string;
  reviewText: string;
  posterImage: string;
}

const WritePage: NextPage = () => {
  const route = useRouter();

  // 💫 title, releaseYear, posterImage <- Main/Search에서 받는 값
  // 💫 rating, reviewText, ticketId <- User Ticket에서 받는 값
  const { title, releaseYear, posterImage, rating, reviewText, ticketId } =
    route.query as unknown as WriteFormProps;

  return (
    <WriteForm
      title={title}
      releaseYear={releaseYear}
      posterImage={posterImage}
      rating={rating}
      reviewText={reviewText}
      ticketId={ticketId}
    />
  );
};

export default WritePage;
