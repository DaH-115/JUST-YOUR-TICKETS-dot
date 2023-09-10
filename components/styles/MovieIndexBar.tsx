import styled from 'styled-components';

const MovieIndexBar = styled.div<{ routePath?: string }>`
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  width: ${({ theme }) => theme.posterWidth};
  padding: 1rem;

  color: #fff;
  font-size: ${({ routePath }) => (routePath === '/' ? '2.5rem' : '1rem')};
  font-weight: 700;
  background: linear-gradient(180deg, #0e0e0eef, transparent);

  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
`;

export default MovieIndexBar;
