import styled from 'styled-components';

const Description = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: 1rem 0;
  margin-bottom: 0;
  margin-left: ${({ theme }) => theme.space.small};

  ${({ theme }) => theme.device.tablet} {
    font-size: 1rem;
    margin-left: ${({ theme }) => theme.space.medium};
    margin-bottom: 1.5rem;
  }
`;

export default Description;
