import styled from 'styled-components';

const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
  padding-bottom: 2rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 0.9rem;
  }
`;

export default OverviweText;
