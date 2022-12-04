import styled from 'styled-components';

export const MovieIndexBar = styled.div<{ routePath?: string }>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 4rem;

  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.black} 30%,
    transparent
  );

  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  padding: 0.5rem 0.8rem 0 1.4rem;
`;
