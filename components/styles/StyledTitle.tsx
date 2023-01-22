import styled from 'styled-components';

const SlideTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-top: 2rem;
  margin-left: ${({ theme }) => theme.space.small};

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.5rem;
    font-weight: 700;
    margin-left: ${({ theme }) => theme.space.medium};
  }
`;

export default SlideTitle;
