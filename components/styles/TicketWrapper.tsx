import styled from 'styled-components';

const TicketWrapper = styled.div`
  width: ${({ theme }) => theme.posterWidth};
  margin: 0 auto;
  margin-top: 2rem;

  ${({ theme }) => theme.device.tablet} {
    margin: 0;
    padding-top: 1rem;

    &:hover {
      transform: translateY(-1rem);
      transition: transform 200ms ease-in-out;
    }
  }
`;

export default TicketWrapper;
