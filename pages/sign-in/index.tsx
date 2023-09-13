import { useState, useRef, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { isAuth } from 'firebase-config';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';

import withHeadMeta from 'components/common/withHeadMeta';
import { useAuthState } from 'store/auth-context';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import SignFormLayout from 'components/layout/SignFormLayout';

const SignInPage: NextPage = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSigned } = useAuthState();
  const [isError, setIsError] = useState<boolean>(false);
  // User EMAIL-PASSWORD Text
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  // Validation State
  const [isEmail, setIsEmail] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const isDisabled = isEmail && isPassword ? false : true;
  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  useEffect(() => {
    if (isSigned) {
      router.replace('/');
    }
  }, [isSigned]);

  const getUserHandler = async () => {
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(isAuth, userEmail, userPassword);
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    getUserHandler();
  };

  const onEmailChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserEmail(target.value);

    const emailCheckRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailValue = target.value;

    if (!emailCheckRegex.test(emailValue)) {
      setIsEmail(false);
    } else {
      setIsEmail(true);
    }
  };

  const onPasswordChangeHandler = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>) => {
    setUserPassword(target.value);

    const passwordCheckRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordValue = target.value;

    if (!passwordCheckRegex.test(passwordValue)) {
      setIsPassword(false);
    } else {
      setIsPassword(true);
    }
  };

  const onSocialSignInHandler = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const target = event.currentTarget as HTMLButtonElement;
    setIsLoading(true);

    try {
      if (target.name === 'google-sign-in') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(isAuth, provider);
      }

      if (target.name === 'github-sign-in') {
        const provider = new GithubAuthProvider();
        await signInWithPopup(isAuth, provider);
      }
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  return (
    <SignFormLayout formTitle='Sign In /로그인'>
      {isLoading && <LoadingSpinner />}
      {isError && (
        <ErrorMsg>{'아이디 또는 비밀번호를 확인해 주세요.'}</ErrorMsg>
      )}

      <SignInForm onSubmit={onSubmitHandler}>
        <InputLabel htmlFor='user-email'>{'Email /이메일'}</InputLabel>
        <StyledInput
          type='text'
          id='user-email'
          value={userEmail}
          onChange={onEmailChangeHandler}
          ref={inputRef}
        />
        <ValidationMsg isState={isEmail}>
          {!userEmail
            ? '이메일을 입력해 주세요.'
            : !isEmail
            ? '이메일은 " @ " , " . " 을 포함해야합니다.'
            : null}
        </ValidationMsg>

        <InputLabel htmlFor='user-password'>{'Password /비밀번호'}</InputLabel>
        <StyledInput
          type='password'
          id='user-password'
          value={userPassword}
          onChange={onPasswordChangeHandler}
        />

        <ValidationMsg isState={isPassword}>
          {!userPassword
            ? '비밀번호를 입력해 주세요.'
            : !isPassword
            ? '숫자 + 영문자 + 특수문자 조합으로 8자리 이상 입력해야 합니다.'
            : null}
        </ValidationMsg>
        <SignInBtn type='submit' disabled={isDisabled}>
          {'로그인'}
        </SignInBtn>

        <Link href='/sign-up'>
          <SignUpBtn>{'회원가입'}</SignUpBtn>
        </Link>
      </SignInForm>

      <SocialSignInWrapper>
        <SocialSignInBtn name='github-sign-in' onClick={onSocialSignInHandler}>
          <BsGithub />
        </SocialSignInBtn>
        <SocialSignInBtn name='google-sign-in' onClick={onSocialSignInHandler}>
          <FcGoogle />
        </SocialSignInBtn>
      </SocialSignInWrapper>
    </SignFormLayout>
  );
};

export default withHeadMeta(SignInPage, '로그인');

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 0.8rem;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  border: none;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.orange};
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

const SignInBtn = styled.button`
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

const SignUpBtn = styled.button`
  width: 100%;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  border: 0.05rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.orange};
    transition: all 400ms ease-in-out;
  }
`;

const SocialSignInWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  margin-bottom: 1rem;
`;

const SocialSignInBtn = styled.button`
  color: ${({ theme }) => theme.colors.gray};
  padding: 0 0.5rem;

  svg {
    font-size: 2rem;
  }
`;
