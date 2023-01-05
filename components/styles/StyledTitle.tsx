import styled from 'styled-components';

const SlideTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: ${({ theme }) => theme.space.mobile};

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.5rem;
    font-weight: 700;
    margin-left: ${({ theme }) => theme.space.tablet};
  }
`;

export default SlideTitle;
