import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import BackgroundStyle from './layout/BackgroundStyle';
import { SystemError } from 'errorType';

interface WriteFormProps {
  ticketId: string;
  title: string;
  releaseYear: string;
  rating?: string;
  reviewText?: string;
  posterImage?: string;
}

// 💫 title, releaseYear, posterImage <- Main/Search/MovieDetailPage에서 받는 값
// 💫 rating, reviewText, ticketId <- UserTicket에서 받는 값
const WriteForm = ({
  ticketId,
  title,
  releaseYear,
  rating,
  reviewText,
  posterImage,
}: WriteFormProps) => {
  const router = useRouter();
  const [creatorId, setCreatorId] = useState<string>('');
  const ratingRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLTextAreaElement>(null);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    // ✔️ props로 받아온 값(reviewText && rating)이 있으면 ref에 넣어준다
    if (rating && reviewText) {
      ratingRef.current!.value = rating;
      reviewRef.current!.value = reviewText;
    }
  }, []);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCreatorId(user.uid);
        }
      });
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  }, []);

  const updateContents = async (
    rating: string,
    reviewText: string,
    ticketId: string
  ) => {
    const userTicketRef = doc(db, 'users-tickets', `${ticketId}`);

    try {
      await updateDoc(userTicketRef, {
        rating,
        reviewText,
      });

      console.log('Update Complete!');
      router.push('/ticket-list');
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  };

  const addContents = async (rating: string, reviewText: string) => {
    try {
      await addDoc(collection(db, 'users-tickets'), {
        creatorId,
        createdAt: Date.now(),
        title,
        releaseYear,
        rating,
        reviewText,
        posterImage,
      });

      console.log('Add contents complete!');
      router.push('/ticket-list');
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ratingText = ratingRef.current!.value;
    const reviewText = reviewRef.current!.value;

    // ✔️ UPDATE
    if (ticketId) {
      updateContents(ratingText, reviewText, ticketId);
      return;
    }

    addContents(ratingText, reviewText);
  };

  return (
    <BackgroundStyle customMessage='write✒️' backgroundColor='black'>
      <WriteFormWrapper>
        <MovieDetailWrapper>
          <p>{today}</p>
          <MovieTitle>
            <p>* Movie Title /제목</p>"{title}"(
            {releaseYear})
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
              <StyledLabel htmlFor='review'>* Review /나의 감상</StyledLabel>
              <StyledDesc>당신의 생각과 느낌을 적어보세요.</StyledDesc>
              <StyledTextarea name='reviewText' id='review' ref={reviewRef} />
            </InputWrapper>
            <StyledButton>Submit</StyledButton>
          </StyledForm>
        </FormWrapper>
      </WriteFormWrapper>
    </BackgroundStyle>
  );
};

export default WriteForm;

const WriteFormWrapper = styled.div`
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
  font-family: 'Montserrat', 'Noto Sans KR', sans-serif;
  letter-spacing: -0.06em;

  width: 100%;
  height: 10rem;
  margin-top: 0.6rem;
  border-radius: 0.4rem;
  padding: 0.6rem 0.8rem;
  font-size: 1rem;
  letter-spacing: -0.06em;
  border: 1px solid ${({ theme }) => theme.colors.gray};

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
  font-size: 1rem;
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
  font-weight: 300;
  letter-spacing: -0.09em;
  color: ${({ theme }) => theme.colors.gray};
`;
