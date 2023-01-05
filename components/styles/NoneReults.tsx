import styled from 'styled-components';

const NoneResults = styled.p`
  width: 100%;
  height: 100vh;
  color: #fff;
  padding-top: 1rem;
  padding-left: ${({ theme }) => theme.space.mobile};
  font-size: 1.2rem;
  font-weight: 400;

  ${({ theme }) => theme.device.tablet} {
    padding-left: ${({ theme }) => theme.space.tablet};
  }
`;

export default NoneResults;
