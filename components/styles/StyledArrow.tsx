import styled from 'styled-components';

export const StyledArrow = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;

  color: ${({ theme }) => theme.colors.yellow};
  border: 0.1rem solid white;
  border-radius: 50%;
  filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 1));

  text-align: center;
  line-height: 2.5rem;

  &:hover {
    color: #000;
    border: 0.1rem solid #fff;
    background-color: #fff;
  }

  &:active {
    color: #000;
    border: 0.1rem solid ${({ theme }) => theme.colors.yellow};
    background-color: ${({ theme }) => theme.colors.yellow};
  }

  &::before {
    display: none;
  }

  z-index: 999;
`;
