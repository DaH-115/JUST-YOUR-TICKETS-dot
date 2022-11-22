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
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const SlideTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;

  ${({ theme }) => theme.device.desktop} {
    padding-left: 2rem;
    font-size: 2.4rem;
    font-weight: 700;
  }
`;
