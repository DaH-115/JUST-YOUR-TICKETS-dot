import styled from 'styled-components';

const MovieDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 2rem 0 0;
  overflow-y: scroll;
  ${({ theme }) => theme.scrollbarStyle.scrollbarReset}

  ${({ theme }) => theme.device.tablet} {
    flex-direction: row;
    padding: 2rem;
  }
`;

export default MovieDetailWrapper;
