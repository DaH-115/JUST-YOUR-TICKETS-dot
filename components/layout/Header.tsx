import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Error from 'next/error';
import { useRouter } from 'next/router';
import { isAuth } from 'firebase-config';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineMenu } from 'react-icons/md';
import { SystemError } from 'errorType';
import { useAuthState } from 'components/store/auth-context';
import SignInAlert from 'components/modals/SignInAlert';
import SlideMenu from 'components/modals/SlideMenu';

const Header = () => {
  const router = useRouter();
  const { isSigned } = useAuthState();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSignOutHandler = useCallback(async () => {
    try {
      await isAuth.signOut();
      router.reload();
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  }, []);

  const onCheckSignInHandler = useCallback(() => {
    if (!isSigned) {
      setIsChecked((prev) => !prev);
    } else {
      router.push('/search');
    }
  }, [isSigned]);

  const onCheckedHandler = useCallback(() => {
    setIsChecked((prev) => !prev);
  }, []);

  const onToggleHandler = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <HeaderMenu>
      <LogoWrapper>
        <div>{'JUST'}</div>
        <StyledLogo>{'MY'}</StyledLogo>
        <div>{'TICKTES.'}</div>
      </LogoWrapper>

      <MenuWrapper>
        <Link href='/'>
          <MenuItem>{'Home'}</MenuItem>
        </Link>
        {isSigned && (
          <Link href='/ticket-list'>
            <MenuItem>{'My Tickets'}</MenuItem>
          </Link>
        )}
        {isSigned ? (
          <MenuItem onClick={onSignOutHandler}>{'Sign Out'}</MenuItem>
        ) : (
          <Link href='/sign-in'>
            <MenuItem>{'Sign In'}</MenuItem>
          </Link>
        )}
      </MenuWrapper>

      <SearchIcon onClick={onCheckSignInHandler}>
        <BiSearch />
      </SearchIcon>

      <SlideMenu isopen={isOpen} closeHandler={onToggleHandler}>
        <Link href='/'>
          <MenuItem>{'Home'}</MenuItem>
        </Link>
        {isSigned && (
          <Link href='/search'>
            <MenuItem>{'Search'}</MenuItem>
          </Link>
        )}
        {isSigned && (
          <Link href='/ticket-list'>
            <MenuItem>{'My Tickets'}</MenuItem>
          </Link>
        )}
        {isSigned ? (
          <MenuItem onClick={onSignOutHandler}>{'Sign Out'}</MenuItem>
        ) : (
          <Link href='/sign-in'>
            <MenuItem>{'Sign In'}</MenuItem>
          </Link>
        )}
      </SlideMenu>
      <SlideMenuIcon onClick={onToggleHandler}>
        <MdOutlineMenu />
      </SlideMenuIcon>

      {isChecked && <SignInAlert onToggleHandler={onCheckedHandler} />}
    </HeaderMenu>
  );
};

export default React.memo(Header);

const HeaderMenu = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 1rem;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.black};
  padding: 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 1rem 2rem;
  }
`;

const LogoWrapper = styled.h1`
  color: ${({ theme }) => theme.colors.yellow};
`;

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;

const MenuWrapper = styled.ul`
  display: none;

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    align-items: center;
  }
`;

const MenuItem = styled.li`
  color: #fff;
  padding: 1rem;
  cursor: pointer;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;

const SearchIcon = styled.div`
  display: none;

  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;

  margin-left: 0.5rem;

  color: #000;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 50%;

  cursor: pointer;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.yellow};
    transition: color 200ms ease-in-out;
  }

  ${({ theme }) => theme.device.tablet} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const SlideMenuIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;

  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 50%;

  margin-left: 0.5rem;

  cursor: pointer;

  &:active {
    color: ${({ theme }) => theme.colors.yellow};
    transition: color 200ms ease-in-out;
  }

  ${({ theme }) => theme.device.tablet} {
    display: none;
  }
`;
