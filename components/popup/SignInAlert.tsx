import React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalAlertPopup from './PortalAlert';
import AlertPopup from '../layout/AlertPopup';

const SignInAlert = ({ onToggleHandler }: { onToggleHandler: () => void }) => {
  const router = useRouter();

  const onMoveSignInHandler = useCallback(() => {
    router.push('/sign-in');
  }, []);

  return (
    <PortalAlertPopup>
      <AlertPopup
        popupType='alert'
        popupMessage='로그인이 필요한 페이지 입니다.&nbsp; 로그인 페이지로 이동 합니다.'
        onCancelHandler={onToggleHandler}
        onConfirmHandler={onMoveSignInHandler}
      />
    </PortalAlertPopup>
  );
};

export default React.memo(SignInAlert);
