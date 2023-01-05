import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'firebase-config';
import styled from 'styled-components';
import Error from 'next/error';

import TicketInfoBtn from 'components/ticket/TicketInfoBtn';
import MovieTicketDetail from 'components/ticket/MovieTicketDetail';
import PosterImage from 'components/ticket/PosterImage';
import AlertPopup from 'components/layout/AlertPopup';
import PortalAlertPopup from 'components/popup/PortalAlert';
import UpdateBtn from 'components/ticket/UpdateBtn';
import DeleteBtn from 'components/ticket/DeleteBtn';
import TicketWrapper from 'components/styles/TicketWrapper';
import MovieIndexBar from 'components/styles/MovieIndexBar';
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
        <PortalAlertPopup>
          <AlertPopup
            popupType='modal'
            popupMessage='정말 티켓을 삭제할까요?'
            onCancelHandler={onToggleHandler}
            onConfirmHandler={onDeleteHandler}
          />
        </PortalAlertPopup>
      )}

      <MovieIndexBar>
        <WriteDate>{writeDate}</WriteDate>
        <BtnWrapper>
          {/* DELETE BUTTON */}
          <DeleteBtn onToggle={onToggleHandler} />

          {/* UPDATE BUTTON */}
          <UpdateBtn
            title={title}
            ticketId={ticketId}
            releaseYear={releaseYear}
            rating={rating}
            reviewText={reviewText}
            posterImage={posterImage}
          />

          {/* GO TO MOVIE INFO PAGE BUTTON */}
          <TicketInfoBtn
            title={title}
            releaseYear={releaseYear}
            posterImage={posterImage}
            rating={rating}
            reviewText={reviewText}
          />
        </BtnWrapper>
      </MovieIndexBar>

      {/* POSTER IMAGE Section */}
      <PosterImage title={title} posterImage={posterImage} />

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
