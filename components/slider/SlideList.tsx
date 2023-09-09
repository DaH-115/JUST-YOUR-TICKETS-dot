import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface SlideListProps {
  children: ReactNode;
  title: string;
  description: string;
  ticketLength?: number;
}

const SlideList = ({
  children,
  title,
  description,
  ticketLength,
}: SlideListProps) => {
  return (
    <SlideListWrapper>
      <SlideHeader>
        <SlideTitle>{title}</SlideTitle>
        {ticketLength && <TicketLength>{`${ticketLength} 장`}</TicketLength>}
      </SlideHeader>
      <Description>{description}</Description>
      {children}
    </SlideListWrapper>
  );
};

export default React.memo(SlideList);

const SlideListWrapper = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const SlideHeader = styled.div`
  display: flex;

  ${({ theme }) => theme.device.tablet} {
  }
`;

const SlideTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;

  ${({ theme }) => theme.device.tablet} {
  }
`;

const Description = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.gray};

  ${({ theme }) => theme.device.tablet} {
  }
`;

const TicketLength = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: 1rem;
`;
