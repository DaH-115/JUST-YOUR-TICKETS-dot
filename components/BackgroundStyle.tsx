import { ReactNode } from 'react';
import styled from 'styled-components';

const BackgroundStyle = ({
  customMessage,
  children,
}: {
  customMessage: string;
  children: ReactNode;
}) => {
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

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
  box-sizing: border-box;
`;

const PageTitle = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.black};
  margin-bottom: 3rem;
  padding: 1rem;
`;

const CustomMessage = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;

export default BackgroundStyle;
