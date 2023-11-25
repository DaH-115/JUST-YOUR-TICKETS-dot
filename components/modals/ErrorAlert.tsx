import React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Alert from 'components/modals/Alert';
import { useAppDispatch } from 'store/hooks';
import { modalIsClose } from 'store/modalSlice';

const ErrorAlert = ({ errorMessage }: { errorMessage: string }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const goToBackHandler = useCallback(() => {
    router.push('/');
    dispatch(modalIsClose());
  }, []);

  return <Alert alertDesc={errorMessage} onConfirmHandler={goToBackHandler} />;
};

export default React.memo(ErrorAlert);
