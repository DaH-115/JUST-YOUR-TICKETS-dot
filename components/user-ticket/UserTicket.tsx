import { useState } from 'react';
import { useRouter } from 'next/router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import styled from 'styled-components';

import InfoButton from '../ticket/InfoButton';
import MovieTicketDetail from '../ticket/MovieTicketDetail';
import PosterImage from '../ticket/PosterImage';
import AlertPopup from '../../components/layout/AlertPopup';
import PortalAlertPopup from '../popup/PortalAlert';
import { TicketWrapper } from '../styles/TicketWrapper';
import { MovieIndexBar } from '../styles/MovieIndexBar';
import { SystemError } from 'errorType';
import { UserTicketProps } from 'ticketType';
import UpdateButton from '../common/UpdateButton';
import DeleteButton from '../common/DeleteButton';

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

  const onDeleteHandler = async () => {
    const userTicketRef = doc(db, 'users-tickets', `${ticketId}`);
    setIsOpen((prev) => !prev);

    try {
      await deleteDoc(userTicketRef);
      console.log('Delete Complete!');
      router.reload();
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  };

  const onToggleHandler = () => {
    setIsOpen((prev) => !prev);
  };

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
        <ButtonWrapper>
          {/* DELETE BUTTON */}
          <DeleteButton onToggle={onToggleHandler} />

          {/* UPDATE BUTTON */}
          <UpdateButton
            title={title}
            ticketId={ticketId}
            releaseYear={releaseYear}
            rating={rating}
            reviewText={reviewText}
            posterImage={posterImage}
          />

          {/* 🎈 GO TO MOVIE INFO PAGE BUTTON */}
          <InfoButton
            title={title}
            releaseYear={releaseYear}
            posterPath={posterImage}
            voteAverage={+rating}
            overview={reviewText}
          />
        </ButtonWrapper>
      </MovieIndexBar>

      {/* POSTER IMAGE Section */}
      <PosterImage title={title} posterPath={posterImage} />

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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  padding-right: 0.4rem;
`;

const StyledBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 0.5rem;
  height: 0.5rem;
  padding: 1rem 0.8rem;
  border-radius: 50%;

  button {
    color: #fff;
    font-size: 1rem;
    line-height: 1rem;
    margin-right: 1rem;
  }
`;
