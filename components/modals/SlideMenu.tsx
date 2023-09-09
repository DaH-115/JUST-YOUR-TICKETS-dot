import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import PortalComponents from 'components/modals/PortalComponents';
import { AiOutlineClose } from 'react-icons/ai';

interface SlideMenuProps {
  children: ReactNode;
  isopen: boolean;
  closeHandler: () => void;
}

const SlideMenu = ({ children, isopen, closeHandler }: SlideMenuProps) => {
  return (
    <PortalComponents>
      <SlideMenuWrapper isopen={isopen} onClick={closeHandler}>
        <LogoWrapper>
          <div>{'JUST'}</div>
          <StyledLogo>{'MY'}</StyledLogo>
          <div>{'TICKTES.'}</div>
        </LogoWrapper>
        {children}
        <CloseBtn>
          <AiOutlineClose />
        </CloseBtn>
      </SlideMenuWrapper>
    </PortalComponents>
  );
};

export default React.memo(SlideMenu);

// Animation Setting
const fadeSlideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
  }
  to {
    transform: translateY(0);
    opacity: 1;
    pointer-events: none;
  }
`;

const fadeSlideOut = keyframes`
  from {
      transform: translateY(0);
      opacity: 1;
      pointer-events: none;
  }
  to {
      transform: translateY(100%);
      opacity: 0;
      pointer-events: none;
  }
`;

const SlideMenuWrapper = styled.div<{ isopen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  visibility: ${({ isopen }) => (isopen ? 'visible' : 'hidden')};
  animation: ${({ isopen }) => (isopen ? fadeSlideIn : fadeSlideOut)} 0.4s
    ease-in-out;
  transition: visibility 0.4s ease-in-out;

  width: 100%;
  height: 100vh;

  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  background-color: ${({ theme }) => theme.colors.black};
  padding: 2rem 1rem;

  list-style: none;
`;

const LogoWrapper = styled.div`
  color: ${({ theme }) => theme.colors.yellow};
  font-size: 1rem;
  border-bottom: 0.2rem dotted ${({ theme }) => theme.colors.orange};

  margin: 1rem;
  margin-top: 0;

  padding-bottom: 1rem;
`;

const StyledLogo = styled.div`
  color: ${({ theme }) => theme.colors.orange};
`;

const CloseBtn = styled.div`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 1.8rem;
  margin-left: 1rem;

  padding: 1rem;
  padding-left: 0;

  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;
