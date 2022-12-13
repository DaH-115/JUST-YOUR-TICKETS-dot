import React from 'react';
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
      <SlideTextWrapper>
        <SlideTitle>{title}</SlideTitle>
        {ticketLength && <TicketLength>{ticketLength} 장</TicketLength>}
      </SlideTextWrapper>
      {children}
    </Container>
  );
};

export default React.memo(SlideList);

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const SlideTextWrapper = styled.div`
  display: flex;
`;

const TicketLength = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-left: 1rem;
`;
