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

import MovieTicketDetail from 'components/ticket/MovieTicketDetail';
import PosterImage from 'components/ticket/PosterImage';
import AlertPopup from 'components/modals/AlertPopup';
import TicketWrapper from 'components/styles/TicketWrapper';
import MovieIndexBar from 'components/styles/MovieIndexBar';
import StyeldInfo from 'components/styles/StyeldInfo';
import StyledBtn from 'components/styles/StyledBtn';
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
  const [isOpen, setIsOpen] = useState(false);
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
          {/* DELETE BUTTON */}
          <DeleteBtnWrapper onClick={onToggleHandler}>
            <button>
              <BiTrash />
            </button>
          </DeleteBtnWrapper>

          {/* UPDATE BUTTON */}
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
            <StyledBtn>
              <button>
                <BiPencil />
              </button>
            </StyledBtn>
          </Link>

          {/* GO TO MOVIE INFO PAGE BUTTON */}
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
            <StyeldInfo>
              <AiFillInfoCircle />
            </StyeldInfo>
          </Link>
        </BtnWrapper>
      </MovieIndexBar>

      {/* POSTER IMAGE Section */}
      <PosterImage
        title={title}
        releaseYear={releaseYear}
        posterImage={posterImage}
      />

      {/* TICKET DETAIL Section */}
      <MovieTicketDetail
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

const WriteDate = styled.p`
  font-size: 1rem;
  font-weight: 700;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const DeleteBtnWrapper = styled(StyledBtn)`
  button {
    margin-bottom: 0.05rem;
  }
`;
