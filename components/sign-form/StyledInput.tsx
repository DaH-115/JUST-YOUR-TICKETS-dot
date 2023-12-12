import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 1rem;
  border: none;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.orange};
  }
`;

export default StyledInput;
