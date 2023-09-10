import styled from 'styled-components';

const StyledArrow = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  line-height: 2.5rem;
  text-align: center;

  color: #fff;
  border: 0.1rem solid #fff;
  border-radius: 50%;

  &:hover,
  &:active {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.orange};
    border-color: ${({ theme }) => theme.colors.orange};
    transition: all ease-in-out 200ms;
  }

  &::before {
    display: none;
  }

  z-index: 999;
`;

// ARROW BUTTON STYLE
export const StyledArrowNext = styled(StyledArrow)`
  right: 2rem;
`;
export const StyledArrowPrev = styled(StyledArrow)`
  left: 2rem;
`;
