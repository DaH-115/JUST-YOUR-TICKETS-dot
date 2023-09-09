import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import withHeadMeta from 'components/common/withHeadMeta';
import WriteForm from 'components/write-form/WriteForm';
import SignInAlert from 'components/modals/SignInAlert';
import { useAuthState } from 'components/store/auth-context';
import { WriteFormProps } from 'ticketType';

const WritePage: NextPage = () => {
  const router = useRouter();
  const { isSigned } = useAuthState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { title, releaseYear, posterImage, rating, reviewText, ticketId } =
    router.query as unknown as WriteFormProps;

  useEffect(() => {
    if (!isSigned) {
      setIsOpen(true);
    }
  }, [isSigned]);

  const onToggleHandler = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <>
      {isOpen && <SignInAlert onToggleHandler={onToggleHandler} />}
      <WriteForm
        title={title}
        releaseYear={releaseYear}
        posterImage={posterImage}
        rating={rating}
        reviewText={reviewText}
        ticketId={ticketId}
      />
    </>
  );
};

export default withHeadMeta(WritePage, '리뷰 작성');
