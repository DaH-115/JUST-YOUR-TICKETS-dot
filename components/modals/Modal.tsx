import { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import PortalComponents from 'components/modals/PortalComponents';

const Modal = ({ children }: { children: ReactNode }) => {
  return (
    <PortalComponents>
      <BackDrop />
      <ModalWrapper>
        <ModalTitle>{'알림'}</ModalTitle>
        {children}
      </ModalWrapper>
    </PortalComponents>
  );
};

export default Modal;

// Animation Setting
const FadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;

  -webkit-backdrop-filter: blur(0.5rem);
  backdrop-filter: blur(0.5rem);
  background-color: rgba(0, 0, 0, 0.2);
  animation: ${FadeIn} 400ms ease-in-out;
  pointer-events: none;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 90%;
  min-width: ${({ theme }) => theme.size.mobile};
  padding: 1rem;
  background-color: #fff;
  border-radius: 1rem;
  background: linear-gradient(white 50%, ${({ theme }) => theme.colors.yellow});
  animation: ${FadeIn} 0.5s ease-in-out;
  z-index: 999;

  ${({ theme }) => theme.device.tablet} {
    max-width: ${({ theme }) => theme.size.mobile};
  }
`;

const ModalTitle = styled.p`
  font-weight: 700;
  margin-bottom: 0.6rem;
`;
