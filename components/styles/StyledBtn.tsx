import styled from 'styled-components';

export const StyledBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 1rem;
  height: 1rem;
  padding: 1rem 0.8rem;
  border-radius: 50%;

  button {
    color: #fff;
    font-size: 1.4rem;
    margin-right: 1rem;

    &:hover,
    &:active {
      color: ${({ theme }) => theme.colors.orange};
      transition: color ease-in-out 150ms;
    }
  }
`;
