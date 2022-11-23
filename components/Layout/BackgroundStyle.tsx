import Link from 'next/link';
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
      <Link href='/'>
        <PageTitle backgroundColor={backgroundColor}>
          <p>JUST</p>
          <CustomMessage>{customMessage}</CustomMessage>
          <p>TICKTES.</p>
        </PageTitle>
      </Link>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<{ backgroundColor: string }>`
  width: 100%;
  height: 100%;
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
  padding: 1rem;
  margin-bottom: 2rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 3rem;
    line-height: 3rem;
    padding: 2rem;
    margin-bottom: 5rem;
  }
`;

const CustomMessage = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;

export default BackgroundStyle;
