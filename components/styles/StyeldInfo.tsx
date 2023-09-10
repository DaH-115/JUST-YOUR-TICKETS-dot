import styled from 'styled-components';

const StyeldInfo = styled.div`
  font-size: 1.8rem;
  color: #fff;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;

export default StyeldInfo;
