import styled from 'styled-components';
import { SlideTitle } from './styles/StyledTitle';

const SlideList = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <Container>
      <SlideTitle>{title}</SlideTitle>
      {children}
    </Container>
  );
};

export default SlideList;

const Container = styled.div`
  width: auto;
  background-color: ${({ theme }) => theme.colors.black};
`;
