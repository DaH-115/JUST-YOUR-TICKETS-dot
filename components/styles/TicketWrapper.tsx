import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: 360px;
  margin-top: 2rem;
  margin-left: 0.5rem;
  margin-right: 1rem;
  filter: drop-shadow(0px 0px 30px rgba(115, 115, 115, 0.2));

  ${({ theme }) => theme.device.desktop} {
    margin-top: 4rem;

    &:hover {
      transform: translateY(-3rem);
      transition: transform ease-in-out 250ms;
    }
  }
`;
