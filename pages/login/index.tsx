import { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';

import BackgroundStyle from '../../components/layout/BackgroundStyle';

const LoginPage: NextPage = () => {
  const [userId, setUserId] = useState('');
  const [signUp, setSignUp] = useState(false);
  const [userPassword, setUserPassword] = useState('');

  const onSignUpToggleHandler = () => {
    setSignUp((prev) => !prev);
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(userId, userPassword);
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'user-id') {
      setUserId(event.target.value);
      return;
    }

    if (event.target.id === 'user-password') {
      setUserPassword(event.target.value);
      return;
    }
  };

  return (
    <BackgroundStyle customMessage='create📝' backgroundColor='black'>
      <LoginFormWrapper>
        <LoginForTitle>
          {!signUp ? '*Sign In /로그인' : '*Sign Up /회원가입'}
        </LoginForTitle>
        <LoginForm onSubmit={onSubmitHandler}>
          <label htmlFor='user-id'>*ID /아이디</label>
          <StyledInput
            type='text'
            id='user-id'
            value={userId}
            onChange={onChangeHandler}
          />
          <label htmlFor='user-password'>*PASSWORD /비밀번호</label>
          <StyledInput
            type='password'
            id='user-password'
            value={userPassword}
            onChange={onChangeHandler}
          />
          <LoginBtn>입력</LoginBtn>
        </LoginForm>
        <ToggleText onClick={onSignUpToggleHandler}>
          {!signUp ? '회원가입' : '로그인'}
        </ToggleText>
      </LoginFormWrapper>
    </BackgroundStyle>
  );
};

export default LoginPage;

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
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.device.desktop} {
    font-size: 1.5rem;
    margin-bottom: 3rem;
    padding-left: 0;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 90%;

  label {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.gray};
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
  }

  ${({ theme }) => theme.device.desktop} {
    width: 30%;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
  font-weight: 700;

  &[type='password'] {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const LoginBtn = styled.button`
  font-size: 1rem;
  font-weight: 700;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.orange};
  border-radius: 1.4rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.yellow};
  }
`;

const ToggleText = styled.p`
  font-size: 0.8rem;
  color: #fff;
  text-align: center;

  cursor: pointer;

  &:hover,
  &:active {
    border-bottom: 0.1rem solid #fff;
  }
`;
