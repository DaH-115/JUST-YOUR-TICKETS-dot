import styled from 'styled-components';

const StyeldInfo = styled.div`
  font-size: 1.8rem;
  color: #ffffffbe;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 150ms;
  }
`;

export default StyeldInfo;
