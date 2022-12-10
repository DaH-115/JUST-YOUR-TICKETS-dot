import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: 360px;
  margin: 2rem 1rem 0 0.5rem;
  filter: drop-shadow(0px 0px 30px rgba(115, 115, 115, 0.2));

  ${({ theme }) => theme.device.desktop} {
    &:hover {
      transform: translateY(-1rem);
      transition: transform ease-in-out 250ms;
    }
  }
`;
