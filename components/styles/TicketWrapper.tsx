import styled from 'styled-components';

export const TicketWrapper = styled.div`
  width: ${({ theme }) => theme.posterWidth};
  margin: 2rem 2.5rem;
  margin-bottom: 0;

  ${({ theme }) => theme.device.tablet} {
    margin: 0;
    padding-top: 1rem;
  }

  ${({ theme }) => theme.device.desktop} {
    &:hover {
      transform: translateY(-1rem);
      transition: transform 200ms ease-in-out;
    }
  }
`;
