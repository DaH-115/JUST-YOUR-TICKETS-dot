import styled from 'styled-components';

export const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: 1rem 0;
  margin-bottom: 0;
  margin-left: ${({ theme }) => theme.space.mobile};

  ${({ theme }) => theme.device.tablet} {
    margin-left: ${({ theme }) => theme.space.tablet};
    margin-bottom: 1.5rem;
  }
`;
