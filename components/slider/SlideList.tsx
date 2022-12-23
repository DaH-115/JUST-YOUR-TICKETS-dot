import React from 'react';
import styled from 'styled-components';
import { Description } from '../styles/Description';
import { SlideTitle } from '../styles/StyledTitle';

const SlideList = ({
  title,
  description,
  children,
  ticketLength,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  ticketLength?: number;
}) => {
  return (
    <Container>
      <SlideTextWrapper>
        <SlideTitle>{title}</SlideTitle>
        {ticketLength ? (
          <TicketLength>{`${ticketLength} 장`}</TicketLength>
        ) : null}
      </SlideTextWrapper>
      <Description>{description}</Description>
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
  margin-top: 1rem;
  margin-left: 1rem;
`;
