import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useAppSelector } from 'store/hooks';
import ErrorAlert from 'components/modals/ErrorAlert';
import SignInAlert from 'components/modals/SignInAlert';

const Layout = ({ children }: { children: ReactNode }) => {
  const errorAlertState = useAppSelector(
    (state) => state.modal.errorAlertState
  );
  const errorState = useAppSelector((state) => state.userTicket.isError);
  const signAlertState = useAppSelector((state) => state.modal.signAlertState);

  return (
    <LayoutdWrapper>
      {errorAlertState || errorState !== '' ? (
        <ErrorAlert errorMessage={errorState} />
      ) : undefined}
      {signAlertState && <SignInAlert />}
      {children}
    </LayoutdWrapper>
  );
};

export default Layout;

const LayoutdWrapper = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100vh;
`;
