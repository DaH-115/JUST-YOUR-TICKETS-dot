import styled from 'styled-components';

export const MovieIndexBar = styled.div<{ routePath?: string }>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: ${({ theme }) => theme.posterWidth};
  padding: 0.3rem 1rem;

  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(180deg, #0e0e0eef, transparent);

  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
`;
