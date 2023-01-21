import React from 'react';
import { ReactNode } from 'react';
import styled from 'styled-components';

interface BackgroundStyleProps {
  children: ReactNode;
  customMessage: string;
}

const BackgroundStyle = ({ children, customMessage }: BackgroundStyleProps) => {
  return (
    <Wrapper>
      <PageTitle>
        <p>{'JUST'}</p>
        <CustomMessage>{customMessage}</CustomMessage>
        <p>{'TICKTES.'}</p>
      </PageTitle>
      {children}
    </Wrapper>
  );
};

export default BackgroundStyle;

const Wrapper = styled.div`
  width: 100%;
  background: linear-gradient(#000 10%, ${({ theme }) => theme.colors.black});
`;

const PageTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.yellow};
  padding-top: 1rem;
  padding-left: ${({ theme }) => theme.space.mobile};

  ${({ theme }) => theme.device.tablet} {
    padding-left: ${({ theme }) => theme.space.tablet};
  }
`;

const CustomMessage = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;
