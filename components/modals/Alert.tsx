import React from 'react';
import styled from 'styled-components';
import Modal from 'components/modals/Modal';

const Alert = ({ onConfirmHandler }: { onConfirmHandler: () => void }) => {
  return (
    <Modal>
      <AlertDesc>{'로그인이 필요한 페이지 입니다.'}</AlertDesc>
      <AlertBtn onClick={onConfirmHandler}>{'네'}</AlertBtn>
    </Modal>
  );
};

export default React.memo(Alert);

const AlertDesc = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1rem;
  }
`;

const AlertBtn = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.black};

  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 1rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    transition: color 200ms ease-in-out;
  }
`;
