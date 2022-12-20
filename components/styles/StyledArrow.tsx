import styled from 'styled-components';

const StyledArrow = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  line-height: 2.5rem;

  color: #fff;
  border: 0.1rem solid #fff;
  border-radius: 50%;
  filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 1));

  text-align: center;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.yellow};
    transition: color ease-in-out 150ms;

    background: linear-gradient(
      transparent 30%,
      ${({ theme }) => theme.colors.orange}
    );
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
