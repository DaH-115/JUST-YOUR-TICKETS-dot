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
  const [isUser, setIsUser] = useState<boolean>(false);

  // 💫 title, releaseYear, posterImage <- Main/Search에서 받는 값
  // 💫 rating, reviewText, ticketId <- User Ticket에서 받는 값
  const { title, releaseYear, posterImage, rating, reviewText, ticketId } =
    router.query as unknown as WriteFormProps;

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          setIsOpen(true);
        } else {
          setIsUser(true);
        }
      });
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

  useEffect(() => {
    const routeChangeStart = (url: string) => {
      if (url !== '/ticket-list' && isUser) {
        alert('작성하던 내용이 사라지게 됩니다. 페이지를 나가시겠습니까?');
      }
    };

    router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [isUser]);

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

export default withHeadMeta(WritePage, '리뷰 쓰기');
