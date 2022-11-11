import { ReactNode } from 'react';
import styled from 'styled-components';

interface BackgroundStyleProps {
  children: ReactNode;
  customMessage: string;
  backgroundColor: string;
}

const BackgroundStyle = ({
  children,
  customMessage,
  backgroundColor,
}: BackgroundStyleProps) => {
  return (
    <Wrapper backgroundColor={backgroundColor}>
      <PageTitle backgroundColor={backgroundColor}>
        <p>JUST</p>
        <CustomMessage>{customMessage}</CustomMessage>
        <p>TICKTES.</p>
      </PageTitle>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 100vh;
  background-color: ${(props) =>
    props.backgroundColor === 'black'
      ? props.theme.colors.black
      : props.theme.colors.yellow};
`;

const PageTitle = styled.div<{ backgroundColor: string }>`
  font-size: 2rem;
  font-weight: 700;
  line-height: 2rem;
  color: ${(props) =>
    props.backgroundColor === 'black' ? '#fff' : props.theme.colors.black};
  margin-bottom: 1rem;
  padding: 1rem;
`;

const CustomMessage = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;

export default BackgroundStyle;
