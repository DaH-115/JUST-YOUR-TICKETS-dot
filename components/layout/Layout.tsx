import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useAppSelector } from 'store/hooks';
import ErrorAlert from 'components/modals/ErrorAlert';
import SignInAlert from 'components/modals/SignInAlert';

const Layout = ({ children }: { children: ReactNode }) => {
  const errorAlertState = useAppSelector(
    (state) => state.modal.errorAlertState
  );
  const signAlertState = useAppSelector((state) => state.modal.signAlertState);

  return (
    <LayoutWrapper>
      {errorAlertState ? (
        <ErrorAlert errorMessage={'문제가 발생했습니다.'} />
      ) : undefined}
      {signAlertState && <SignInAlert />}
      {children}
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
`;
