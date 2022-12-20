import React, { useCallback } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { BiSearch } from 'react-icons/bi';
import { auth } from '../../firebase';

import { SystemError } from 'errorType';

const Header = ({ isUser }: { isUser: boolean }) => {
  const router = useRouter();

  const onSignOutHandler = useCallback(async () => {
    try {
      await auth.signOut();
      router.reload();
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

  return (
    <HeaderMenu>
      <Link href='/'>
        <HeaderLi className='home'>HOME</HeaderLi>
      </Link>
      {isUser && (
        <Link href='/ticket-list'>
          <HeaderLi>MY TICKETS</HeaderLi>
        </Link>
      )}
      <Link href='/search'>
        <SearchIcon path={router.pathname}>
          <BiSearch id='search-icon' />
        </SearchIcon>
      </Link>
      {isUser ? (
        <HeaderLi onClick={onSignOutHandler}>LOGOUT</HeaderLi>
      ) : (
        <Link href='/sign-in'>
          <HeaderLi className='home'>SIGN IN</HeaderLi>
        </Link>
      )}
    </HeaderMenu>
  );
};

export default React.memo(Header);

const HeaderMenu = styled.ul`
  display: flex;
  justify-content: center;
  font-weight: 700;

  ${({ theme }) => theme.device.tablet} {
    position: absolute;
    top: 2rem;
    right: 8rem;
    font-size: 1.2rem;
  }
`;

const HeaderLi = styled.li`
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 150ms;
  }

  ${({ theme }) => theme.device.tablet} {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;

export const SearchIcon = styled.div<{ path?: string }>`
  position: fixed;
  top: 3rem;
  right: ${({ theme }) => theme.space.mobile};
  z-index: 999;

  width: 3rem;
  height: 3rem;
  font-size: 1.8rem;
  color: #fff;
  padding: 0.5rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 50%;
  filter: drop-shadow(10px 10px 10px #0000004e);

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.yellow};
    transition: color 150ms ease-in-out;
    background: linear-gradient(
      ${({ theme }) => theme.colors.black} 60%,
      ${({ theme }) => theme.colors.orange}
    );
  }

  #search-icon {
    margin-top: 2px;
    margin-left: 1px;
  }

  ${({ theme }) => theme.device.tablet} {
    top: 2rem;
    right: ${({ theme }) => theme.space.tablet};
  }

  ${({ theme }) => theme.device.desktop} {
    top: 1.5rem;
    right: ${({ theme }) => theme.space.tablet};
  }
`;
