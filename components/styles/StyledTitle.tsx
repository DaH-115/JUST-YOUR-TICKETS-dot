import styled from 'styled-components';

export const SlideTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  padding-left: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 2.2rem;
    font-weight: 700;
    padding-left: 2rem;
  }
`;
