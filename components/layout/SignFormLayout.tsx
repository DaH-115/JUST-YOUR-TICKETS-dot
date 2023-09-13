import { ReactNode } from 'react';
import styled from 'styled-components';

interface SignLayoutProps {
  children: ReactNode;
  formTitle: string;
}

const SignFormLayout = ({ children, formTitle }: SignLayoutProps) => {
  return (
    <BackgroundStyle>
      <SignFormWrapper>
        <SignFormTitle>{formTitle}</SignFormTitle>
        {children}
      </SignFormWrapper>
    </BackgroundStyle>
  );
};

export default SignFormLayout;

const BackgroundStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const SignFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 0 1rem;

  ${({ theme }) => theme.device.tablet} {
    width: ${({ theme }) => theme.size.mobile};
  }
`;

const SignFormTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 2rem;
  }
`;
