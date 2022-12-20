import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: 320px;
  margin: 2rem 2.5rem;
  margin-bottom: 0;

  ${({ theme }) => theme.device.tablet} {
    margin: 0;
  }
`;
