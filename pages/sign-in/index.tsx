import { useState, useRef, useEffect, useCallback } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { auth } from '../../firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { SystemError } from 'errorType';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';

import withHeadMeta from '../../components/common/withHeadMeta';
import BackgroundStyle from '../../components/layout/BackgroundStyle';
import LoadingMsg from '../../components/common/LoadingMsg';
import Error from 'next/error';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const [signUp, setSignUp] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          router.replace('/');
        } else {
          router.replace('/sign-in');
        }
      });
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

  const getUser = async () => {
    setIsLoading(true);

    if (signUp) {
      // Sign Up
      try {
        await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      } catch (error) {
        const err = error as SystemError;
        <Error statusCode={err.statusCode} />;
        setIsError(true);
      }
    } else {
      // Sign In
      try {
        await signInWithEmailAndPassword(auth, userEmail, userPassword);
      } catch (error) {
        const err = error as SystemError;
        <Error statusCode={err.statusCode} />;
        setIsError(true);
      }
    }

    setIsLoading(false);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    getUser();
    setUserEmail('');
    setUserPassword('');
  };

  const onSignUpToggleHandler = useCallback(() => {
    setSignUp((prev) => !prev);
  }, []);

  const onEmailChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserEmail(target.value);

      const emailCheckRegex =
        /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      const emailValue = target.value;

      if (!emailCheckRegex.test(emailValue)) {
        setIsEmail(false);
      } else {
        setIsEmail(true);
      }
    },
    []
  );

  const onPasswordChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserPassword(target.value);

      const passwordCheckRegex =
        /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
      const passwordValue = target.value;

      if (!passwordCheckRegex.test(passwordValue)) {
        setIsPassword(false);
      } else {
        setIsPassword(true);
      }
    },
    []
  );

  const onSocialSignInHandler = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLButtonElement;
      setIsLoading(true);

      try {
        if (target.name === 'google-signin') {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
        }

        if (target.name === 'github-signin') {
          const provider = new GithubAuthProvider();
          await signInWithPopup(auth, provider);
        }
      } catch (error) {
        const err = error as SystemError;
        <Error statusCode={err.statusCode} />;
      }

      setIsLoading(false);
    },
    []
  );

  return (
    <BackgroundStyle customMessage='create📝'>
      {isLoading ? (
        <LoadingMsg />
      ) : (
        <>
          <LoginFormWrapper>
            <LoginForTitle>
              {signUp ? '*Sign Up /회원가입' : '*Sign In /로그인'}
            </LoginForTitle>
            {isError && (
              <ErrorMsg>{'아이디 또는 비밀번호를 확인해 주세요'}.</ErrorMsg>
            )}
            <LoginForm onSubmit={onSubmitHandler}>
              {/* ID */}
              <label htmlFor='user-id'>*EMAIL /이메일</label>
              <StyledInput
                type='text'
                id='user-id'
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
                {'입력'}
              </LoginBtn>
            </LoginForm>
          </LoginFormWrapper>
          <SocialSignInWrapper>
            <SocialSignInIcon>
              <button name='github-signin' onClick={onSocialSignInHandler}>
                <BsGithub />
              </button>
            </SocialSignInIcon>
            <SocialSignInIcon>
              <button name='google-signin' onClick={onSocialSignInHandler}>
                <FcGoogle />
              </button>
            </SocialSignInIcon>
          </SocialSignInWrapper>
          <ToggleText onClick={onSignUpToggleHandler}>
            {signUp ? '로그인' : '회원가입'}
          </ToggleText>
        </>
      )}
    </BackgroundStyle>
  );
};

export default withHeadMeta(LoginPage, '로그인');

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

const ToggleText = styled.p`
  font-size: 1rem;
  color: #fff;
  text-align: center;
  margin-top: 1.2rem;

  cursor: pointer;
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

    &:hover,
    &:active {
      color: #fff;
      transition: color ease-in-out 100ms;
    }

    svg {
      color: #fff;
      font-size: 1.5rem;
      margin: 0 0.5rem;
    }
  }
`;
