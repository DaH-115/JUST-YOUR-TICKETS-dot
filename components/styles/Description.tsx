import styled from 'styled-components';

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray};
  margin: 1rem 0;
  margin-bottom: 0;
  margin-left: ${({ theme }) => theme.space.small};

  ${({ theme }) => theme.device.tablet} {
    margin-left: ${({ theme }) => theme.space.medium};
    margin-bottom: 1.5rem;
  }
`;

export default Description;
