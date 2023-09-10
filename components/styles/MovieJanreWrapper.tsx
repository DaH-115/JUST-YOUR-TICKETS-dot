import styled from 'styled-components';

const JanreWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 2rem;
  font-size: 1rem;
  overflow-y: scroll;

  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  li {
    margin-right: 0.4rem;

    &:not(:first-child)::before {
      content: '/';
    }

    &:last-child {
      margin-right: 0;
    }
  }
`;

export default JanreWrapper;
