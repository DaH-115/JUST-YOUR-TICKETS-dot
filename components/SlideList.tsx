import styled from 'styled-components';

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

const SlideTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  padding-left: 1rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 2.4rem;
    font-weight: 700;
    padding-left: 2rem;
  }
`;
