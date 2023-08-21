import styled from 'styled-components';

export const MovieDetailWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: 2rem 0;

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const DetailTextWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 1.5rem 2rem;
  background: linear-gradient(white 70%, ${({ theme }) => theme.colors.yellow});
  margin-top: 1rem;
  margin-bottom: -2rem;

  ${({ theme }) => theme.device.tablet} {
    max-width: 600px;
    padding: 1.2rem 1rem;
    margin: 0 0 2rem 2rem;
    border-radius: 1rem;
  }
`;

export const StyledLabeling = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;

  &:first-child {
    margin-bottom: 0.6rem;
  }
`;

export const ContentText = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  h1 {
    font-weight: 700;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.orange};
    padding-bottom: 0.5rem;
  }
`;

export const OverviweText = styled.p`
  width: 100%;
  font-size: 1rem;
`;
