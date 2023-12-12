import styled from 'styled-components';

const SignUpBtn = styled.button`
  width: 100%;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border: 0.05rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.orange};
    transition: all 400ms ease-in-out;
  }
`;

export default SignUpBtn;
