import styled from 'styled-components';

export const MovieIndexBar = styled.div<{ routePath?: string }>`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 320px;
  padding: 0.3rem 1rem;

  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(180deg, #000000f1, transparent);

  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
`;
