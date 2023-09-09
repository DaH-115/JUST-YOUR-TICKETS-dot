import styled from 'styled-components';

const SlideTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-top: 2rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.5rem;
  }
`;

export default SlideTitle;
