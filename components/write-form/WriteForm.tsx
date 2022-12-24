import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase-config';

import { useAuthState } from '../store/auth-context';
import BackgroundStyle from '../layout/BackgroundStyle';
import { SystemError } from 'errorType';
import { WriteFormProps } from 'ticketType';
import Error from 'next/error';

// title, releaseYear, posterImage <- Main/Search/MovieDetailPage에서 받는 값
// rating, reviewText, ticketId <- UserTicket에서 받는 값
const WriteForm = ({
  ticketId,
  title,
  releaseYear,
  rating,
  reviewText,
  posterImage,
}: WriteFormProps) => {
  const router = useRouter();
  const { userId, isSigned } = useAuthState();
  const [ratingVal, setRatingVal] = useState<boolean>(true);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  const ratingRef = useRef<HTMLInputElement>(null);
  const reviewRef = useRef<HTMLTextAreaElement>(null);
  const today = new Date().toLocaleDateString();

  useEffect(() => {
    const routeChangeStart = (url: string) => {
      if (url !== router.asPath && isSigned && !isConfirm) {
        alert('작성하던 내용이 사라지게 됩니다. 페이지를 나가시겠습니까?');
      }
    };

    router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [isSigned, isConfirm]);

  useEffect(() => {
    // props로 받아온 값(reviewText && rating)이 있으면 ref에 넣어준다
    if (rating && reviewText) {
      ratingRef.current!.value = rating;
      reviewRef.current!.value = reviewText;
    }
  }, [rating, reviewText]);

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

      router.push('/ticket-list');
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  };

  const addContents = async (rating: string, reviewText: string) => {
    try {
      await addDoc(collection(db, 'users-tickets'), {
        creatorId: userId,
        createdAt: Date.now(),
        title,
        releaseYear,
        rating,
        reviewText,
        posterImage,
      });

      router.push('/ticket-list');
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let ratingText: string = '';
    let reviewText: string = '';
    setIsConfirm(true);

    if (ratingRef.current!.value && reviewRef.current!.value) {
      ratingText = ratingRef.current!.value;
      reviewText = reviewRef.current!.value;
    } else {
      alert('내용을 채워주세요.');
    }

    // UPDATE
    if (ticketId) {
      updateContents(ratingText, reviewText, ticketId);
    }

    addContents(ratingText, reviewText);
  };

  const onRatingChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      Number(target.value) > 10 ? setRatingVal(false) : setRatingVal(true);
    },
    []
  );

  return (
    <BackgroundStyle customMessage='write✒️'>
      <WriteFormWrapper>
        <MovieDetailWrapper>
          <p>{today}</p>
          <MovieTitle>
            <p>{'* Movie Title /제목'}</p>
            {`"${title}"(${releaseYear})`}
          </MovieTitle>
        </MovieDetailWrapper>

        <FormWrapper>
          <StyledForm onSubmit={onSubmitHandler}>
            <InputWrapper>
              <StyledLabel htmlFor='rating'>{'* Rating /점수'}</StyledLabel>
              <StyledDesc>{'얼마나 좋았나요?'}</StyledDesc>
              <RatingInputWrapper>
                <StyledInput
                  name='rating'
                  id='rating'
                  ref={ratingRef}
                  onChange={onRatingChangeHandler}
                />
                <p>{' /10'}</p>
              </RatingInputWrapper>
              <ValidationMsg isState={ratingVal}>
                {'최대 10점까지 줄 수 있어요.'}
              </ValidationMsg>
            </InputWrapper>
            <InputWrapper>
              <StyledLabel htmlFor='review'>
                {'* Review /나의 감상'}
              </StyledLabel>
              <StyledDesc>{'나의 생각과 느낌을 적어보세요.'}</StyledDesc>
              <StyledTextarea name='reviewText' id='review' ref={reviewRef} />
            </InputWrapper>
            <StyledBtn>{'입력'}</StyledBtn>
          </StyledForm>
        </FormWrapper>
      </WriteFormWrapper>
    </BackgroundStyle>
  );
};

export default WriteForm;

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.orange};
`;

const WriteFormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  height: 100%;
  padding: 1.5rem;
  background-color: #fff;
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
  filter: drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.4));

  ${({ theme }) => theme.device.tablet} {
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
  margin-bottom: 0.5rem;

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

const StyledBtn = styled.button`
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
