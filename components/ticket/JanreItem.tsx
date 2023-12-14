import styled from 'styled-components';

const JanreItem = styled.li`
  padding: 0.5rem 0.8rem;
  margin: 0.1rem;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.black};
  border: 0.05rem solid ${({ theme }) => theme.colors.black};
  border-radius: 1rem;

  &:last-child {
    margin-right: 0;
  }

  &:hover,
  :active {
    color: ${({ theme }) => theme.colors.black};
    background-color: #fff;
    border: 0.05rem solid ${({ theme }) => theme.colors.black};
  }
`;

export default JanreItem;
