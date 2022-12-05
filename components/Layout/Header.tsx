import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { SystemError } from 'errorType';

const Header = () => {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        }
      });
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  }, []);

  const onSignOutHandler = async () => {
    try {
      await auth.signOut();
      setUserId('');
      router.push('/signin');
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  };

  return (
    <HeaderMenu>
      <Link href='/'>
        <HeaderLi className='home'>HOME</HeaderLi>
      </Link>
      {userId && (
        <Link href='/ticket-list'>
          <HeaderLi>MY TICKETS</HeaderLi>
        </Link>
      )}
      <Link href='/search'>
        <SearchIcon path={router.pathname}>
          <BiSearch id='search-icon' />
        </SearchIcon>
      </Link>
      {userId ? (
        <HeaderLi onClick={onSignOutHandler}>LOGOUT</HeaderLi>
      ) : (
        <Link href='/sign-in'>
          <HeaderLi className='home'>SIGN IN</HeaderLi>
        </Link>
      )}
    </HeaderMenu>
  );
};

export default Header;

const HeaderMenu = styled.ul`
  display: flex;
  justify-content: center;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.device.tablet} {
    position: absolute;
    top: 2rem;
    right: 6rem;
    padding-left: 0;
    font-size: 1.2rem;
  }
`;

const HeaderLi = styled.li`
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;

  ${({ theme }) => theme.device.tablet} {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;

export const SearchIcon = styled.div<{ path?: string }>`
  position: fixed;
  top: 3rem;
  right: 1rem;
  z-index: 999;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
  padding: 0.5rem;
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

  ${({ theme }) => theme.device.tablet} {
    top: 2rem;
    right: 2rem;
  }
`;
