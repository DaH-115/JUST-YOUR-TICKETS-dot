import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { AiFillInfoCircle } from 'react-icons/ai';
import { BiPencil } from 'react-icons/bi';
import { BiTrash } from 'react-icons/bi';
import { useAppDispatch } from 'store/hooks';
import { deleteTicket } from 'store/userticketSlice';
import { UserTicketProps } from 'ticketType';
import TicketDetails from 'components/ticket/TicketDetails';
import PosterImage from 'components/ticket/PosterImage';
import Confirm from 'components/modals/Confirm';

const UserTicket = ({
  id: ticketId,
  title,
  releaseYear,
  posterImage,
  rating,
  reviewText,
  createdAt,
}: UserTicketProps) => {
  const router = useRouter();
  const writeDate = new Date(createdAt).toLocaleDateString();
  const dispatch = useAppDispatch();
  const [confirmState, setConfirmState] = useState<boolean>(false);

  const onToggleHandler = useCallback(() => {
    setConfirmState((prev) => !prev);
  }, []);

  const onDeleteHandler = useCallback(() => {
    dispatch(deleteTicket(ticketId));
    setConfirmState(false);
  }, [dispatch, ticketId]);

  return (
    <TicketWrapper>
      {confirmState && (
        <Confirm
          confirmMessage='정말 티켓을 삭제할까요?'
          onConfirmHandler={onDeleteHandler}
          onCancelHandler={onToggleHandler}
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
                ticketId,
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
  padding: 0 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 0 0.5rem;
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
