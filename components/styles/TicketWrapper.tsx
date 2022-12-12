import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: 360px;
  margin: 2rem 1.5em;
  margin-bottom: 0;
  filter: drop-shadow(0px 0px 30px rgba(115, 115, 115, 0.2));

  ${({ theme }) => theme.device.tablet} {
    margin: 2rem 1em;
    margin-bottom: 0;

    &:hover {
      transform: translateY(-1rem);
      transition: transform ease-in-out 250ms;
    }
  }
`;
