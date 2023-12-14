import styled from 'styled-components';

const DetailTextWrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.size.tablet};
  padding: 2rem 1rem;
  margin-top: 1rem;
  background: linear-gradient(#fff 80%, ${({ theme }) => theme.colors.yellow});

  border-radius: 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 2.5rem 3rem 1.5rem;
    margin-left: 1rem;
  }
`;

export default DetailTextWrapper;
