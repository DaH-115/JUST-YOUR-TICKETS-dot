import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import { isAuth } from 'firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'store/auth-context';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  validateEAdress,
  validateId,
  validatePassword,
} from 'hooks/useValidation';
import { loadingIsOpen, modalIsClose } from 'store/modalSlice';
import withHead from 'components/common/withHead';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import {
  SignFormLayout,
  StyledInput,
  ValidationMsg,
  ErrorMsg,
  SignUpBtn,
  InputLabel,
  SignForm,
} from 'components/sign-form';

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { isSigned } = useAuthState();
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector((state) => state.modal.loadingState);
  const [isError, setIsError] = useState<boolean>(false);
  const [isArrowToggle, setIsArrowToggle] = useState<boolean>(false);
  // User EMAIL Text
  const [emailId, setEmailId] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('default');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAnotherAddress, setIsAnotherAddress] = useState<boolean>(false);
  // User PASSWORD Text
  const [userPassword, setUserPassword] = useState<string>('');
  const [checkedPassword, setCheckedPassword] = useState<string>('');
  // Validation State
  const [isEmailCheck, setIsEmailCheck] = useState<boolean>(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState<boolean>(false);
  const [isSamePwCheck, setIsSamePwCheck] = useState<boolean>(false);
  const isDisabled =
    isEmailCheck && isPasswordCheck && isSamePwCheck ? false : true;

  useEffect(() => {
    if (isSigned) {
      router.replace('/');
    }
  }, [isSigned]);

  const getUserHandler = async () => {
    dispatch(loadingIsOpen());

    try {
      await createUserWithEmailAndPassword(isAuth, userEmail, userPassword);
    } catch (error) {
      setIsError(true);
    }

    dispatch(modalIsClose());
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    getUserHandler();
  };

  const onIdChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    const validationCheck = validateId(target.value);
    if (validationCheck) {
      setIsEmailCheck(false);
    } else {
      setEmailId(target.value);
      setIsEmailCheck(true);
    }
  };

  const onAddressChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (target.value === 'another-address') {
      setIsAnotherAddress(true);
      setEmailAddress('');
    } else {
      setEmailAddress(target.value);
    }
  };

  const onAddressBlurHandler = () => {
    const validationCheck = validateEAdress(emailAddress);

    if (emailId && validationCheck) {
      setUserEmail(`${emailId}@${emailAddress}`);
      setIsEmailCheck(true);
    } else {
      setIsEmailCheck(false);
      setIsAnotherAddress(false);
    }
  };

  const onSelectBlurHandler = () => {
    if (emailId && emailAddress) {
      setUserEmail(`${emailId}@${emailAddress}`);
      setIsEmailCheck(true);
    } else {
      setIsEmailCheck(false);
    }
  };

  const onPasswordChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(target.value);
  };

  const onPasswordBlurHandler = () => {
    const validationCheck = validatePassword(userPassword);
    if (validationCheck) {
      setIsPasswordCheck(true);
    } else {
      setIsPasswordCheck(false);
    }
  };

  const onPasswordCheckHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPassword(target.value);
  };

  const onPWCheckInputBlurHandler = () => {
    userPassword === checkedPassword && setIsSamePwCheck(true);
  };

  return (
    <>
      {loadingState ? (
        <LoadingSpinner />
      ) : (
        <SignFormLayout formTitle='Sign Up /회원가입'>
          {isError && (
            <ErrorMsg>{'아이디 또는 비밀번호를 확인해 주세요.'}</ErrorMsg>
          )}

          <SignForm onSubmit={onSubmitHandler}>
            <InputLabel htmlFor='user-email'>{'Email /이메일'}</InputLabel>
            <EmailInputWrapper>
              <StyledInput
                type='text'
                id='user-email'
                value={emailId}
                onChange={onIdChangeHandler}
              />
              <AtSign>{'@'}</AtSign>
              <SelectWrapper onClick={() => setIsArrowToggle((prev) => !prev)}>
                {isAnotherAddress ? (
                  <StyledInput
                    type='text'
                    value={emailAddress}
                    onChange={onAddressChangeHandler}
                    onBlur={onAddressBlurHandler}
                  />
                ) : (
                  <>
                    <InputSelect
                      value={emailAddress}
                      onChange={onAddressChangeHandler}
                      onBlur={onSelectBlurHandler}
                    >
                      <option value='default'>{'주소를 선택하세요.'}</option>
                      <option value='naver.com'>{'naver.com'}</option>
                      <option value='gmail.com'>{'gmail.com'}</option>
                      <option value='daum.net'>{'daum.net'}</option>
                      <option value='nate.com'>{'nate.com'}</option>
                      <option value='another-address'>{'직접 입력하기'}</option>
                    </InputSelect>
                    <ArrowBtn>
                      {isArrowToggle ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </ArrowBtn>
                  </>
                )}
              </SelectWrapper>
            </EmailInputWrapper>

            <ValidationMsg isState={isEmailCheck}>
              {'이메일을 확인해 주세요'}
            </ValidationMsg>

            <InputLabel htmlFor='user-password'>
              {'Password /비밀번호'}
            </InputLabel>
            <StyledInput
              type='password'
              id='user-password'
              value={userPassword}
              onChange={onPasswordChangeHandler}
              onBlur={onPasswordBlurHandler}
            />

            <ValidationMsg isState={isPasswordCheck}>
              {!userPassword
                ? '비밀번호를 입력해 주세요.'
                : !isPasswordCheck
                ? '숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해야 합니다.'
                : null}
            </ValidationMsg>

            <InputLabel htmlFor='checked-password'>
              {'Password /비밀번호'}
            </InputLabel>
            <StyledInput
              type='password'
              id='checked-password'
              value={checkedPassword}
              onChange={onPasswordCheckHandler}
              onBlur={onPWCheckInputBlurHandler}
            />

            <ValidationMsg isState={isSamePwCheck}>
              {!checkedPassword
                ? '다시 한번 입력해 주세요.'
                : !isSamePwCheck
                ? '위와 동일한 비밀번호가 아닙니다.'
                : null}
            </ValidationMsg>

            <SignUpBtn type='submit' disabled={isDisabled}>
              {'회원가입'}
            </SignUpBtn>
          </SignForm>
        </SignFormLayout>
      )}
    </>
  );
};

export default withHead(SignUpPage, '회원가입');

const EmailInputWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const SelectWrapper = styled.div`
  width: 100%;
`;

const InputSelect = styled.select`
  width: 100%;
  height: 100%;
  padding: 0.6rem;
  border-radius: 1rem;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &::-ms-expand {
    display: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const AtSign = styled.div`
  color: #fff;
  margin: 0 0.3rem;
  font-size: 0.8rem;
`;

const ArrowBtn = styled.div`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  padding-top: 0.1rem;
`;
