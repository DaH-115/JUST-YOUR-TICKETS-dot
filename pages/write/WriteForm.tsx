import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase-config';
import Error from 'next/error';

import { SystemError } from 'errorType';
import { WriteFormProps } from 'ticketType';
import { useAuthState } from 'store/auth-context';
import Confirm from 'components/modals/Confirm';

const WriteForm = ({
  ticketId,
  title,
  releaseYear,
  rating,
  reviewText,
  posterImage,
}: WriteFormProps) => {
  const router = useRouter();
  const { userId } = useAuthState();
  const [isValidation, setIsValidation] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newRatingText, setNewRatingText] = useState<string>(
    !rating ? '' : rating
  );
  const [newReviewText, setNewReviewText] = useState<string>(
    !reviewText ? '' : reviewText
  );

  useEffect(() => {
    const onPushStateHanlder = () => {
      history.pushState(null, '', location.href);
      setIsOpen(true);
    };

    history.pushState(null, '', location.href);
    window.addEventListener('popstate', onPushStateHanlder);

    return () => {
      window.removeEventListener('popstate', onPushStateHanlder);
    };
  }, []);

  const onConfirmHandler = () => {
    setIsOpen(false);
    router.push(ticketId ? '/ticket-list' : '/');
  };

  const onCancelHandler = () => {
    setIsOpen(false);
  };

  const onUpdateContentsHandler = async (
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

  const onAddContentsHandler = async (rating: string, reviewText: string) => {
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

  const onAddHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    newRatingText && newReviewText
      ? onAddContentsHandler(newRatingText, newReviewText)
      : alert('내용을 작성해 주세요.');
  };

  const onUpdateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    newRatingText && newReviewText
      ? onUpdateContentsHandler(newRatingText, newReviewText, ticketId)
      : alert('내용을 작성해 주세요.');
  };

  const onRatingChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = target.value.trim();

      if (Number(trimmedValue) > 10) {
        setIsValidation(false);
      } else {
        setIsValidation(true);
        setNewRatingText(trimmedValue);
      }
    },
    []
  );

  const onReviewChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
      const trimmedValue = target.value.trim();
      setNewReviewText(trimmedValue);
    },
    []
  );

  return (
    <BackgroundStyle>
      {isOpen && (
        <Confirm
          confirmMessage='작성하던 내용이 사라지게 됩니다. 페이지를 나가시겠습니까?'
          onConfirmHandler={onConfirmHandler}
          onCancelHandler={onCancelHandler}
        />
      )}

      <WriteFormWrapper>
        <MovieDetailWrapper>
          <MovieTitleLabel>{'Movie Title /제목'}</MovieTitleLabel>
          <MovieTitle>{`"${title}"(${releaseYear})`}</MovieTitle>
        </MovieDetailWrapper>

        <StyledForm onSubmit={!ticketId ? onAddHandler : onUpdateHandler}>
          <InputWrapper>
            <StyledLabel htmlFor='rating'>{'Rating /점수'}</StyledLabel>
            <StyledDesc>{'얼마나 좋았나요?'}</StyledDesc>
            <RatingInputWrapper>
              <StyledInput
                name='rating'
                id='rating'
                onChange={onRatingChangeHandler}
                value={newRatingText}
                placeholder='0'
              />
              <LimitNumber>{'/10'}</LimitNumber>
            </RatingInputWrapper>
            <ValidationMsg isState={isValidation}>
              {'최대 10점까지 줄 수 있어요.'}
            </ValidationMsg>
          </InputWrapper>

          <InputWrapper>
            <StyledLabel htmlFor='review'>{'Review /나의 감상'}</StyledLabel>
            <StyledDesc>{'나의 생각과 느낌을 적어보세요.'}</StyledDesc>
            <StyledTextarea
              name='reviewText'
              id='review'
              onChange={onReviewChangeHandler}
              value={newReviewText}
            />
          </InputWrapper>
          <StyledBtn>{!ticketId ? '등록하기' : '수정하기'}</StyledBtn>
        </StyledForm>
      </WriteFormWrapper>
    </BackgroundStyle>
  );
};

export default WriteForm;

const BackgroundStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.black};
  padding: 2rem 0;
  padding-bottom: 0;
`;

const WriteFormWrapper = styled.div`
  background: linear-gradient(#fff 90%, ${({ theme }) => theme.colors.yellow});
  padding: 2rem;
  border-top-right-radius: 1rem;
  border-top-left-radius: 1rem;
  border-top: 0.8rem dotted ${({ theme }) => theme.colors.black};

  ${({ theme }) => theme.device.tablet} {
    border-top-right-radius: 0.9rem;
    border-top-left-radius: 0.9rem;
    border-top: 0.7rem dotted ${({ theme }) => theme.colors.black};
  }
`;

const MovieDetailWrapper = styled.div`
  width: 100%;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 0.1rem dashed ${({ theme }) => theme.colors.orange};
`;

const MovieTitleLabel = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const MovieTitle = styled.h1`
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
`;

const StyledForm = styled.form`
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 0.8rem;
  font-size: 0.8rem;
`;

const RatingInputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LimitNumber = styled.p`
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  font-weight: 700;
`;

const StyledDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.gray};
  margin: 0.2rem 0 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 0.4rem;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
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
    box-shadow: 0 0 0.5rem ${({ theme }) => theme.colors.orange};
  }
`;

const StyledTextarea = styled.textarea`
  font-family: 'Montserrat', 'Noto Sans KR', sans-serif;
  letter-spacing: -0.06em;

  width: 100%;
  height: 10rem;

  font-size: 1rem;
  letter-spacing: -0.06em;
  border-radius: 0.4rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};

  &:focus {
    border-color: ${({ theme }) => theme.colors.orange};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.orange};
  }
`;

const StyledBtn = styled.button`
  width: 100%;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.8rem;
  border-radius: 0.6rem;
  background-color: ${({ theme }) => theme.colors.black};

  &:hover,
  &:active {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  color: ${({ theme }) => theme.colors.orange};
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.4rem;
`;
