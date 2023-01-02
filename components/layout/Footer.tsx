import Link from 'next/link';
import styled from 'styled-components';
import { BsGithub } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer>
      <FooterWrapper>
        <p>{'JUST YOUR TICKETS.'}</p>
        <p>{'ⓒkwak_dahyeon 2023'}</p>
        <Link href='/'>
          <BsGithub />
        </Link>
      </FooterWrapper>
    </footer>
  );
};

export default Footer;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray};
  background-color: #0b0b0b;
  margin-top: 2rem;

  font-size: 0.8rem;
  font-weight: 700;

  p {
    margin-right: 0.5rem;

    &:nth-child(2) {
      font-size: 0.6rem;
    }
  }

  a {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.gray};
  }

  ${({ theme }) => theme.device.tablet} {
    padding: 1.5rem;
    margin-top: 2rem;
  }
`;
