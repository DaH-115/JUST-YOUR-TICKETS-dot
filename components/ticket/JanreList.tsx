import styled from 'styled-components';

const JanreList = styled.ul`
  display: flex;
  flex-wrap: wrap;

  width: 100%;
  height: auto;
  font-size: 0.9rem;
  margin: 0.5rem 0;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}
`;

export default JanreList;
