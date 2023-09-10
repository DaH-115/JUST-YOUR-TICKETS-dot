import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface SlideLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  ticketLength?: number;
}

const SlideLayout = ({
  children,
  title,
  description,
  ticketLength,
}: SlideLayoutProps) => {
  return (
    <SlideLayoutWrapper>
      <SlideHeader>
        <SlideTitle>{title}</SlideTitle>
        {ticketLength && <TicketLength>{`${ticketLength} 장`}</TicketLength>}
      </SlideHeader>
      <Description>{description}</Description>
      {children}
    </SlideLayoutWrapper>
  );
};

export default React.memo(SlideLayout);

const SlideLayoutWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  padding-top: 2rem;
`;

const SlideHeader = styled.div`
  display: flex;
  margin-left: 1rem;

  ${({ theme }) => theme.device.tablet} {
    margin-left: 2rem;
  }
`;

const SlideTitle = styled.h1`
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray};
  margin-left: 1rem;

  ${({ theme }) => theme.device.tablet} {
    margin-left: 2rem;
  }
`;

const TicketLength = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: 1rem;
`;
