import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebase-config';
import Error from 'next/error';

import { useAuthState } from 'components/store/auth-context';
import BackgroundStyle from 'components/layout/BackgroundStyle';
import { SystemError } from 'errorType';
import { WriteFormProps } from 'ticketType';
import AlertPopup from 'components/layout/AlertPopup';

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
  const { userId } = useAuthState();
  const [ratingVal, setRatingVal] = useState<boolean>(true);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date().toLocaleDateString();

  const [newRatingText, setNewRatingText] = useState(!rating ? '' : rating);
  const [newReviewText, setNewReviewText] = useState(
    !reviewText ? '' : reviewText
  );

  useEffect(() => {
    history.pushState(null, '', location.href);

    window.addEventListener('popstate', () => {
      history.pushState(null, '', location.href);
      setIsOpen(true);
    });

    return () => {
      window.removeEventListener('popstate', () => {
        history.pushState(null, '', location.href);
        setIsOpen(true);
      });
    };
  }, []);

  const onConfirmHandler = () => {
    setIsOpen(false);
    router.push(ticketId ? '/ticket-list' : '/');
  };

  const onCancelHandler = () => {
    setIsOpen(false);
  };

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

  const onAddHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isConfirm
      ? addContents(newRatingText, newReviewText)
      : alert('내용을 작성해 주세요.');
  };

  const onUpdateHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isConfirm
      ? updateContents(newRatingText, newReviewText, ticketId)
      : alert('내용을 작성해 주세요.');
  };

  const onRatingChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      if (Number(target.value) > 10) {
        setRatingVal(false);
      } else {
        setRatingVal(true);
        setNewRatingText(target.value);
        setIsConfirm(true);
      }
    },
    []
  );

  const onReviewChangeHandler = useCallback(
    ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewReviewText(target.value);
      setIsConfirm(true);
    },
    []
  );

  return (
    <BackgroundStyle customMessage='write✒️'>
      {isOpen && (
        <AlertPopup
          popupType='modal'
          popupMessage='작성하던 내용이 사라지게 됩니다. 페이지를 나가시겠습니까?'
          onConfirmHandler={onConfirmHandler}
          onCancelHandler={onCancelHandler}
        />
      )}
      <Wrapper>
        <WriteFormWrapper>
          <MovieDetailWrapper>
            <p>{today}</p>
            <MovieTitle>
              <p>{'* Movie Title /제목'}</p>
              {`"${title}"(${releaseYear})`}
            </MovieTitle>
          </MovieDetailWrapper>

          <FormWrapper>
            <StyledForm onSubmit={!ticketId ? onAddHandler : onUpdateHandler}>
              <InputWrapper>
                <StyledLabel htmlFor='rating'>{'* Rating /점수'}</StyledLabel>
                <StyledDesc>{'얼마나 좋았나요?'}</StyledDesc>
                <RatingInputWrapper>
                  <StyledInput
                    name='rating'
                    id='rating'
                    onChange={onRatingChangeHandler}
                    value={newRatingText}
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
                <StyledTextarea
                  name='reviewText'
                  id='review'
                  onChange={onReviewChangeHandler}
                  value={newReviewText}
                />
              </InputWrapper>
              <StyledBtn>{!ticketId ? '입력하기' : '수정하기'}</StyledBtn>
            </StyledForm>
          </FormWrapper>
        </WriteFormWrapper>
      </Wrapper>
    </BackgroundStyle>
  );
};

export default WriteForm;

const ValidationMsg = styled.p<{ isState: boolean }>`
  visibility: ${({ isState }) => (isState ? 'hidden' : 'visible')};
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.orange};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WriteFormWrapper = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.size.tablet};
  margin-top: 2.5rem;
  padding: 1.5rem;
  padding-bottom: 2rem;
  background-color: #fff;
  border-radius: 1.5rem;
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
