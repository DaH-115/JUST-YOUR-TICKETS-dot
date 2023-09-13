import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { isAuth } from 'firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';

import { useAuthState } from 'components/store/auth-context';
import withHeadMeta from 'components/common/withHeadMeta';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import SignFormLayout from 'components/layout/SignFormLayout';

const SignUpPage: NextPage = () => {
  const router = useRouter();
  const { isSigned } = useAuthState();
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
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState<boolean>(false);
  const isDisabled = isEmail && isPassword && isPasswordCheck ? false : true;
  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isSigned) {
      router.replace('/');
    }
  }, [isSigned]);

  const getUserHandler = async () => {
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(isAuth, userEmail, userPassword);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    getUserHandler();
  };

  const onIdChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setEmailId(target.value);
  };

  const onIdBlurHandler = () => {
    if (emailId && emailAddress !== 'default') {
      setUserEmail(`${emailId}@${emailAddress}`);
    }
  };

  const onAddressChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (target.value === 'anotherAddress') {
      setIsAnotherAddress(true);
      setEmailAddress('');
    } else {
      setEmailAddress(target.value);
    }
  };

  const onAnotherAdrsBlurHandler = () => {
    if (isAnotherAddress && emailAddress === '') {
      setIsAnotherAddress(false);
      setIsArrowToggle(false);
    }

    if (emailAddress !== 'default' && emailAddress !== '') {
      const userEmailText = `${emailId}@${emailAddress}`;
      const emailCheckRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

      emailCheckRegex.test(userEmailText)
        ? setIsEmail(true)
        : setIsEmail(false);
      setUserEmail(userEmailText);
    }
  };

  const onSelectBlurHandler = () => {
    if (emailAddress !== 'default') {
      const userEmailText = `${emailId}@${emailAddress}`;

      setUserEmail(userEmailText);
      setIsEmail(true);
    } else {
      setIsEmail(false);
    }
  };

  const onPasswordChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(target.value);
  };

  const onPasswordBlurHandler = () => {
    const passwordCheckRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    passwordCheckRegex.test(userPassword) && setIsPassword(true);
  };

  const onPasswordCheckHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedPassword(target.value);
  };

  const onPWCheckInputBlurHandler = () => {
    userPassword === checkedPassword && setIsPasswordCheck(true);
  };

  return (
    <SignFormLayout formTitle='Sign Up /회원가입'>
      {isLoading && <LoadingSpinner />}
      {isError && (
        <ErrorMsg>{'아이디 또는 비밀번호를 확인해 주세요.'}</ErrorMsg>
      )}

      <SignUpForm onSubmit={onSubmitHandler}>
        <InputLabel htmlFor='user-email'>{'Email /이메일'}</InputLabel>
        <EmailInputWrapper>
          <StyledInput
            type='text'
            id='user-email'
            value={emailId}
            onChange={onIdChangeHandler}
            onBlur={onIdBlurHandler}
          />
          <AtSign>{'@'}</AtSign>
          <SelectWrapper onClick={() => setIsArrowToggle((prev) => !prev)}>
            {isAnotherAddress ? (
              <StyledInput
                type='text'
                value={emailAddress}
                onChange={onAddressChangeHandler}
                onBlur={onAnotherAdrsBlurHandler}
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
                  <option value='anotherAddress'>{'직접 입력하기'}</option>
                </InputSelect>
                <ArrowBtn>
                  {isArrowToggle ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </ArrowBtn>
              </>
            )}
          </SelectWrapper>
        </EmailInputWrapper>
        <ValidationMsg isState={isEmail}>
          {emailId === '' && '이메일을 입력해 주세요. '}
          {isAnotherAddress && !isEmail && '이메일을 확인해 주세요.'}
        </ValidationMsg>

        <InputLabel htmlFor='user-password'>{'Password /비밀번호'}</InputLabel>
        <StyledInput
          type='password'
          id='user-password'
          value={userPassword}
          onChange={onPasswordChangeHandler}
          onBlur={onPasswordBlurHandler}
        />
        <ValidationMsg isState={isPassword}>
          {!userPassword
            ? '비밀번호를 입력해 주세요.'
            : !isPassword
            ? '숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해야 합니다.'
            : null}
        </ValidationMsg>

        <InputLabel htmlFor='user-password-check'>
          {'Password /비밀번호'}
        </InputLabel>
        <StyledInput
          type='password'
          id='user-password-check'
          value={checkedPassword}
          onChange={onPasswordCheckHandler}
          onBlur={onPWCheckInputBlurHandler}
        />
        <ValidationMsg isState={isPasswordCheck}>
          {!checkedPassword
            ? '다시 한번 입력해 주세요.'
            : !isPasswordCheck
            ? '위와 동일한 비밀번호가 아닙니다.'
            : null}
        </ValidationMsg>

        <SignUpBtn type='submit' disabled={isDisabled}>
          {'회원가입'}
        </SignUpBtn>
      </SignUpForm>
    </SignFormLayout>
  );
};

export default withHeadMeta(SignUpPage, '회원가입');

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const EmailInputWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 0.8rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 1rem;
  border: none;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  width: 100%;
  color: ${({ theme, isState }) => (isState ? '#fff' : theme.colors.orange)};
  font-size: 0.9rem;

  margin-top: 0.4rem;
  margin-bottom: 1rem;
`;

const ErrorMsg = styled.p`
  font-size: 0.9rem;
  color: red;
  margin-bottom: 1rem;
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

const SignUpBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;
  margin-bottom: 1rem;

  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    color: ${({ theme }) => theme.colors.black};
  }
`;
