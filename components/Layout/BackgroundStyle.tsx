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
        <p>JUST</p>
        <CustomMessage>{customMessage}</CustomMessage>
        <p>TICKTES.</p>
      </PageTitle>
      {children}
    </Wrapper>
  );
};

export default BackgroundStyle;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    #0b0b0b 10%,
    ${({ theme }) => theme.colors.black}
  );
`;

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.yellow};

  padding-top: 1rem;
  margin-bottom: 2rem;
  margin-left: ${({ theme }) => theme.space.mobile};

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.5rem;
    padding-top: 2rem;
    margin-left: ${({ theme }) => theme.space.tablet};
  }

  ${({ theme }) => theme.device.desktop} {
    margin-bottom: 4rem;
    margin-left: ${({ theme }) => theme.space.desktop};
  }
`;

const CustomMessage = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;
