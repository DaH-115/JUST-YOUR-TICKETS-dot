import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';

const Header = () => {
  const router = useRouter();

  return (
    <HeaderIcons>
      <Link href='/'>
        <HeaderLi className='home'>HOME</HeaderLi>
      </Link>
      <Link href='/ticket-list'>
        <HeaderLi>MY TICKETS</HeaderLi>
      </Link>
      <Link href='/search'>
        <SearchIcon path={router.pathname}>
          <BiSearch id='search-icon' />
        </SearchIcon>
      </Link>
    </HeaderIcons>
  );
};

const HeaderIcons = styled.ul`
  display: flex;
  justify-content: center;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.device.desktop} {
    position: absolute;
    top: 2rem;
    right: 6rem;
    padding-left: 0;
  }
`;

const HeaderLi = styled.li`
  color: #fff;
  padding: 0.5rem;

  ${({ theme }) => theme.device.desktop} {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;

export const SearchIcon = styled.div<{ path?: string }>`
  position: fixed;
  top: 3rem;
  right: 1rem;
  z-index: 999;
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ path, theme }) =>
    path === '/search' ? theme.colors.orange : theme.colors.yellow};
  border-radius: 50%;
  filter: drop-shadow(10px 10px 10px #0000004e);

  #search-icon {
    color: ${({ path, theme }) =>
      path === '/search' ? '#fff' : theme.colors.black};
    margin-top: 1px;
    margin-left: 2px;
  }

  ${({ theme }) => theme.device.desktop} {
    top: 2rem;
    right: 2rem;
  }
`;

export default Header;
