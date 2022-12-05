import styled from 'styled-components';
import { SlideTitle } from '../styles/StyledTitle';

const SlideList = ({
  title,
  ticketLength,
  children,
}: {
  title: string;
  ticketLength?: number;
  children: React.ReactNode;
}) => {
  return (
    <Container>
      <TextWrapper>
        <SlideTitle>{title}</SlideTitle>
        {ticketLength && <TicketLength>{ticketLength} 장</TicketLength>}
      </TextWrapper>
      {children}
    </Container>
  );
};

export default SlideList;

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TicketLength = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-left: 1rem;
`;
