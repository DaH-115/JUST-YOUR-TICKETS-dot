import styled from 'styled-components';

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2rem;
    margin-left: 2rem;
  }
`;

export default PageTitle;
