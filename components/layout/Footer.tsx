import Link from 'next/link';
import styled from 'styled-components';
import { BsGithub } from 'react-icons/bs';

const Footer = () => {
  return (
    <FooterWrapper>
      <ProjectName>{'JUST YOUR TICKETS.'}</ProjectName>
      <Copyright>{'ⓒkwak_dahyeon 2023'}</Copyright>
      <Link href='https://github.com/DaH-115/JUST-MOVIE-TICKETS-dot'>
        <BsGithub />
      </Link>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray};

  background-color: ${({ theme }) => theme.colors.black};
  padding: 1.5rem 0;

  font-size: 0.7rem;
  font-weight: 700;

  a {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.gray};
  }
`;

const ProjectName = styled.p`
  margin-right: 0.5rem;
`;

const Copyright = styled.p`
  font-size: 0.6rem;
  margin-right: 0.5rem;
`;
