import styled from 'styled-components';

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  width: 100%;
  color: ${({ theme, isState }) => (isState ? '#fff' : theme.colors.orange)};
  font-size: 0.9rem;

  margin-top: 0.4rem;
  margin-bottom: 1rem;
`;

export default ValidationMsg;
