import React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';

import AlertPopup from 'components/layout/AlertPopup';

const SignInAlert = ({ onToggleHandler }: { onToggleHandler: () => void }) => {
  const router = useRouter();

  const onMoveSignInHandler = useCallback(() => {
    router.push('/sign-in');
    onToggleHandler();
  }, []);

  return (
    <AlertPopup
      popupType='alert'
      popupMessage='로그인이 필요한 페이지 입니다.&nbsp; 로그인 페이지로 이동 합니다.'
      onCancelHandler={onToggleHandler}
      onConfirmHandler={onMoveSignInHandler}
    />
  );
};

export default React.memo(SignInAlert);
