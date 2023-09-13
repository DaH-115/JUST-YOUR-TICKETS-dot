import React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import Alert from 'components/modals/Alert';

const SignInAlert = ({ onToggleHandler }: { onToggleHandler: () => void }) => {
  const router = useRouter();

  const onMoveSignInHandler = useCallback(() => {
    router.push('/sign-in');
    onToggleHandler();
  }, []);

  return <Alert onConfirmHandler={onMoveSignInHandler} />;
};

export default React.memo(SignInAlert);
