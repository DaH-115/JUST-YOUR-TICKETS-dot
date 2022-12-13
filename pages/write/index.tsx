import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import withHeadMeta from '../../components/common/withHeadMeta';
import WriteForm from '../../components/write-form/WriteForm';
import SignInAlert from '../../components/popup/SignInAlert';
import { WriteFormProps } from 'ticketType';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { SystemError } from 'errorType';
import Error from 'next/error';

const WritePage: NextPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 💫 title, releaseYear, posterImage <- Main/Search에서 받는 값
  // 💫 rating, reviewText, ticketId <- User Ticket에서 받는 값
  const { title, releaseYear, posterImage, rating, reviewText, ticketId } =
    router.query as unknown as WriteFormProps;

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          setIsOpen(true);
        }
      });
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

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
