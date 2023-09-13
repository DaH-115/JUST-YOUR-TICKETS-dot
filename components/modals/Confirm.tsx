import React from 'react';
import styled from 'styled-components';
import Modal from 'components/modals/Modal';

interface ConfirmProps {
  confirmMessage: string;
  onConfirmHandler: () => void;
  onCancelHandler: () => void;
}

const Confirm = ({
  confirmMessage,
  onConfirmHandler,
  onCancelHandler,
}: ConfirmProps) => {
  return (
    <Modal>
      <ConfirmDesc>{confirmMessage}</ConfirmDesc>
      <BtnWrapper>
        <CancelBtn onClick={onCancelHandler}>{'아니요'}</CancelBtn>
        <ConfirmBtn onClick={onConfirmHandler}>{'네'}</ConfirmBtn>
      </BtnWrapper>
    </Modal>
  );
};

export default React.memo(Confirm);

const ConfirmDesc = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1rem;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const StyledBtn = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;

  font-size: 1rem;
  font-weight: 700;
  border-radius: 1rem;
`;

const CancelBtn = styled(StyledBtn)`
  border: 0.1rem solid ${({ theme }) => theme.colors.black};
  margin-right: 0.5rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    border: 0.1rem solid ${({ theme }) => theme.colors.orange};
    transition: all 200ms ease-in-out;
  }
`;

const ConfirmBtn = styled(StyledBtn)`
  color: #fff;
  background-color: ${({ theme }) => theme.colors.black};
  border: 0.1rem solid ${({ theme }) => theme.colors.black};

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    transition: color 200ms ease-in-out;
  }
`;
