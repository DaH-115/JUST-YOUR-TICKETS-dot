import styled from 'styled-components';

export const StyeldInfo = styled.div`
  font-size: 1.8rem;
  color: #fff;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
  }
`;
