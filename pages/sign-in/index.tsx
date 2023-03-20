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
import BackgroundStyle from 'components/layout/BackgroundStyle';
import LoadingMsg from 'components/common/LoadingMsg';
import { useAuthState } from 'components/store/auth-context';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  useEffect(() => {
    if (isSigned) {
      router.replace('/');
    }
  }, [isSigned]);

  const getUser = async () => {
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
    getUser();
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
    <BackgroundStyle customMessage='create📝'>
      {isLoading && <LoadingMsg />}
      <>
        <LoginFormWrapper>
          <LoginForTitle>{'*Sign In /로그인'}</LoginForTitle>
          {isError && (
            <ErrorMsg>{'아이디 또는 비밀번호를 확인해 주세요'}.</ErrorMsg>
          )}
          <LoginForm onSubmit={onSubmitHandler}>
            {/* EMAIL */}
            <label htmlFor='user-email'>*EMAIL /이메일</label>
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

            {/* PASSWORD */}
            <label htmlFor='user-password'>*PASSWORD /비밀번호</label>
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
            <LoginBtn type='submit' disabled={isDisabled}>
              {'로그인'}
            </LoginBtn>

            <Link href='/sign-up'>
              <SignUpBtn>{'회원가입'}</SignUpBtn>
            </Link>
          </LoginForm>
        </LoginFormWrapper>

        <SocialSignInWrapper>
          <SocialSignInIcon>
            <button name='github-sign-in' onClick={onSocialSignInHandler}>
              <BsGithub />
            </button>
          </SocialSignInIcon>
          <SocialSignInIcon>
            <button name='google-sign-in' onClick={onSocialSignInHandler}>
              <FcGoogle />
            </button>
          </SocialSignInIcon>
        </SocialSignInWrapper>
      </>
    </BackgroundStyle>
  );
};

export default withHeadMeta(SignInPage, '로그인');

const LoginFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginForTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-top: 1.5rem;
  margin-bottom: 3rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    padding-left: 0;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 18rem;
  margin-bottom: 1.5rem;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};
    margin-left: 0.5rem;
    margin-bottom: 0.4rem;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  font-weight: 700;
  border: none;
  margin-top: 0.2rem;

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
  font-size: 0.7rem;
  color: ${({ theme, isState }) => (isState ? '#fff' : theme.colors.orange)};
  width: 100%;
  height: 1rem;
  padding-left: 0.2rem;
  margin-top: 0.4rem;
  margin-bottom: 1rem;
`;

const ErrorMsg = styled.p`
  font-size: 0.7rem;
  color: red;
  margin-bottom: 1rem;
`;

const LoginBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;
  margin-top: 1.5rem;

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
  margin-top: 1.5rem;

  &:active,
  :hover {
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.colors.orange};
    transition: all 0.1s ease-in-out;
  }
`;

const SocialSignInWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SocialSignInIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};

    svg {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0.5rem;
    }
  }
`;
