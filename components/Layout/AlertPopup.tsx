import styled from 'styled-components';

interface AlertPopupProps {
  popupType: string;
  popupMessage: string;
  onCancelHandler: () => void;
  onConfirmHandler: () => void;
}

const AlertPopup = ({
  popupType,
  popupMessage,
  onCancelHandler,
  onConfirmHandler,
}: AlertPopupProps) => {
  return (
    <>
      <BackDrop />
      <PopupBox>
        <PopupTitle>*알림</PopupTitle>
        <PopupDesc>{popupMessage}</PopupDesc>
        <PopupBtnWrapper>
          {popupType === 'alert' ? null : (
            <PopupBtnCancel onClick={onCancelHandler}>아니요</PopupBtnCancel>
          )}
          <PopupBtnConfirm onClick={onConfirmHandler}>네</PopupBtnConfirm>
        </PopupBtnWrapper>
      </PopupBox>
    </>
  );
};

export default AlertPopup;

const BackDrop = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  height: 100vh;
  padding: 1rem;

  pointer-events: none;

  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(1px);
  background-color: rgba(0, 0, 0, 0.3);
`;

const PopupBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 18rem;
  padding: 1rem;
  background-color: #fff;
  border-radius: 1rem;
  background: linear-gradient(white 50%, ${({ theme }) => theme.colors.yellow});
  filter: drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.2));
`;

const PopupTitle = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
`;

const PopupDesc = styled.p`
  font-size: 1rem;
  line-height: 1.2;
  margin-bottom: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1rem;
  }
`;

const PopupBtnWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const PopupBtn = styled.div`
  width: 50%;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  text-align: center;
  border-radius: 1rem;

  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }

  &:last-child {
    margin-right: 0;
  }
`;

const PopupBtnConfirm = styled(PopupBtn)`
  padding: 0.6rem 1rem;
  background-color: ${({ theme }) => theme.colors.orange};
`;

const PopupBtnCancel = styled(PopupBtn)`
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};
`;
