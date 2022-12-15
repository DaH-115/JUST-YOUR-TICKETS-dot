import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: 320px;
  margin: 2rem 2.5rem;
  filter: drop-shadow(0px 50px 30px rgba(115, 115, 115, 0.2));

  ${({ theme }) => theme.device.tablet} {
    margin: 0;
  }

  ${({ theme }) => theme.device.desktop} {
    margin-bottom: 4rem;
  }
`;
