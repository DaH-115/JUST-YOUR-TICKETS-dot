import { useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import BackgroundStyle from '../../components/Layout/BackgroundStyle';

const WritePage: NextPage = () => {
  const router = useRouter();
  const { query: routerQuery } = useRouter();
  const today = new Date().toLocaleDateString();
  const ratingRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLTextAreaElement>(null);

  const addContents = async (rating: string, reviewText: string) => {
    try {
      await addDoc(collection(db, 'users-tickets'), {
        createdAt: Date.now(),
        title: routerQuery.title,
        releaseYear: routerQuery.releaseYear,
        rating,
        reviewText,
        posterImage: routerQuery.posterImage,
      });

      console.log('Add contents complete!');
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ratingText = ratingRef.current!.value;
    const reviewText = reviewRef.current!.value;

    addContents(ratingText, reviewText);
    router.push('/ticket-list');
  };

  return (
    <BackgroundStyle customMessage='write✒️' backgroundColor='black'>
      <WriteForm>
        <MovieDetailWrapper>
          <p>{today}</p>
          <MovieTitle>
            <p>* Movie Title /제목</p>"{routerQuery.title}"(
            {routerQuery.releaseYear})
          </MovieTitle>
        </MovieDetailWrapper>
        <FormWrapper>
          <StyledForm onSubmit={onSubmitHandler}>
            <InputWrapper>
              <StyledLabel htmlFor='rating'>* Rating /점수</StyledLabel>
              <StyledDesc>얼마나 좋았나요?</StyledDesc>
              <RatingInputWrapper>
                <StyledInput name='rating' id='rating' ref={ratingRef} />
                <p> /10</p>
              </RatingInputWrapper>
            </InputWrapper>
            <InputWrapper>
              <StyledLabel htmlFor='review'>* Review /리뷰</StyledLabel>
              <StyledDesc>당신의 생각과 느낌을 적어보세요.</StyledDesc>
              <StyledTextarea name='reviewText' id='review' ref={reviewRef} />
            </InputWrapper>
            <StyledButton>Submit</StyledButton>
          </StyledForm>
        </FormWrapper>
      </WriteForm>
    </BackgroundStyle>
  );
};

const WriteForm = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100%;
  padding: 1.5rem;
  background-color: #fff;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.4));

  ${({ theme }) => theme.device.desktop} {
    position: relative;
    bottom: 0;
    right: -50%;
    transform: translateX(-50%);
    height: 90%;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
`;

const RatingInputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.6rem;

  p {
    margin-top: 0.5rem;
    padding: 0.4rem;
  }
`;

const MovieDetailWrapper = styled.div`
  width: 100%;
  height: auto;
  font-weight: 700;
  margin-bottom: 1.6rem;
  border-bottom: 0.1rem solid ${({ theme }) => theme.colors.orange};
  padding-bottom: 0.5rem;

  p {
    font-size: 0.8rem;
    margin-bottom: 1rem;
    font-weight: 300;
  }
`;

const MovieTitle = styled.h1`
  text-align: center;
  font-size: 1.4rem;

  p {
    font-weight: 700;
    font-size: 0.8rem;
    text-align: left;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 700;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 10rem;
  margin-top: 0.6rem;
  border-radius: 0.4rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.6rem;
  letter-spacing: -0.06em;
  border: 1px solid ${({ theme }) => theme.colors.gray};

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1; /* Firefox */
  }

  &::-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${({ theme }) => theme.colors.gray};
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${({ theme }) => theme.colors.gray};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  margin-top: 0.6rem;
  border-radius: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 0.6rem;
  letter-spacing: -0.06em;
  border: 1px solid ${({ theme }) => theme.colors.gray};

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${({ theme }) => theme.colors.gray};
    opacity: 1; /* Firefox */
  }

  &::-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${({ theme }) => theme.colors.gray};
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${({ theme }) => theme.colors.gray};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const StyledButton = styled.button`
  width: 100%;
  height: auto;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.8rem;
  border-radius: 0.6rem;
  background-color: ${({ theme }) => theme.colors.orange};
`;

const StyledDesc = styled.p`
  margin-top: 0.2rem;
  font-size: 0.7rem;
  letter-spacing: -0.09em;
  color: ${({ theme }) => theme.colors.gray};
`;

export default WritePage;
