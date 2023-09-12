import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'firebase-config';
import styled from 'styled-components';
import Error from 'next/error';
import { AiFillInfoCircle } from 'react-icons/ai';
import { BiPencil } from 'react-icons/bi';
import { BiTrash } from 'react-icons/bi';

import TicketDetails from 'components/ticket/TicketDetails';
import PosterImage from 'components/ticket/PosterImage';
import AlertPopup from 'components/modals/AlertPopup';
import { SystemError } from 'errorType';
import { UserTicketProps } from 'ticketType';

const UserTicket = ({
  id: ticketId,
  title,
  releaseYear,
  posterImage,
  rating,
  reviewText,
  createdAt,
}: UserTicketProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const writeDate = new Date(createdAt).toLocaleDateString();

  const onDeleteHandler = useCallback(async () => {
    const userTicketRef = doc(db, 'users-tickets', `${ticketId}`);
    setIsOpen((prev) => !prev);

    try {
      await deleteDoc(userTicketRef);
      router.reload();
    } catch (error) {
      const err = error as SystemError;
      return <Error statusCode={err.statusCode} title={err.message} />;
    }
  }, [ticketId]);

  const onToggleHandler = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <TicketWrapper>
      {isOpen && (
        <AlertPopup
          popupType='modal'
          popupMessage='정말 티켓을 삭제할까요?'
          onCancelHandler={onToggleHandler}
          onConfirmHandler={onDeleteHandler}
        />
      )}

      <MovieIndexBar>
        <WriteDate>{writeDate}</WriteDate>
        <BtnWrapper>
          <DeleteBtnWrapper onClick={onToggleHandler}>
            <DeleteBtn>
              <BiTrash />
            </DeleteBtn>
          </DeleteBtnWrapper>
          <Link
            href={{
              pathname: '/write',
              query: {
                ticketId,
                title,
                releaseYear,
                rating,
                reviewText,
                posterImage,
              },
            }}
            as={`/write`}
          >
            <UpdateBtnWrapper>
              <UpdateBtn>
                <BiPencil />
              </UpdateBtn>
            </UpdateBtnWrapper>
          </Link>

          <Link
            href={{
              pathname: `${router.pathname}/${title}`,
              query: {
                title,
                releaseYear,
                posterImage,
                rating,
                reviewText,
              },
            }}
            as={`${router.pathname}/${title}`}
          >
            <ReviewInfoBtn>
              <AiFillInfoCircle />
            </ReviewInfoBtn>
          </Link>
        </BtnWrapper>
      </MovieIndexBar>

      <PosterImage
        title={title}
        releaseYear={releaseYear}
        posterImage={posterImage}
      />

      <TicketDetails
        title={title}
        releaseYear={releaseYear}
        voteAverage={+rating}
        posterPath={posterImage}
        reviewText={reviewText}
      />
    </TicketWrapper>
  );
};

export default UserTicket;

const TicketWrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  margin-top: 1rem;
`;

const MovieIndexBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 100%;

  color: #fff;
  padding: 0 2rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 0 1rem;
  }
`;

const WriteDate = styled.p`
  font-size: 1.2rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 1rem;
  }
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const UpdateBtnWrapper = styled.div`
  padding: 0.5rem 0.25rem;
`;

const UpdateBtn = styled.button`
  color: #fff;
  font-size: 1.5rem;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;

const DeleteBtnWrapper = styled.div`
  padding: 0.5rem 0.25rem;
`;

const DeleteBtn = styled.button`
  color: #fff;
  font-size: 1.5rem;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;

const ReviewInfoBtn = styled.div`
  font-size: 1.8rem;
  color: #fff;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.orange};
    transition: color ease-in-out 200ms;
  }
`;
