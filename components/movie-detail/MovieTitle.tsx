import styled from 'styled-components';

const MovieTitle = styled.h1`
  font-weight: 700;
  border-bottom: 0.15rem dashed ${({ theme }) => theme.colors.orange};
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding-bottom: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;

export default MovieTitle;
