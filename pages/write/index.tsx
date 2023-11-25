import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuthState } from 'store/auth-context';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { errorAlertIsOpen, signAlertIsOpen } from 'store/modalSlice';
import WriteForm from 'pages/write/WriteForm';
import withHead from 'components/common/withHead';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import { UserTicketDetailsProps } from 'ticketType';
import { getUserTicketDetails } from 'store/userTicketSlice';
import { movieDetailsProps, getTicketDetails } from 'store/movieSlice';

const WritePage: NextPage = () => {
  const router = useRouter();
  const { movieId, ticketId } = router.query as {
    movieId: string;
    ticketId: string;
  };
  const dispatch = useAppDispatch();
  const userTicketData = useAppSelector(
    (state) => state.userTicket.userTicketDetails
  ) as UserTicketDetailsProps;
  const movieDetails = useAppSelector(
    (state) => state.movieData.movieDetails
  ) as movieDetailsProps;
  const { isSigned } = useAuthState();
  const movieDataLoading = useAppSelector((state) => state.movieData.isStatus);
  const userTicketLoading = useAppSelector(
    (state) => state.userTicket.isStatus
  );
  const isLoading = ticketId ? userTicketLoading : movieDataLoading;

  useEffect(() => {
    if (!movieId && !ticketId) {
      dispatch(errorAlertIsOpen());
    } else if (!isSigned) {
      dispatch(signAlertIsOpen());
    }
  }, [movieId, ticketId]);

  useEffect(() => {
    if (ticketId) {
      dispatch(getUserTicketDetails(ticketId));
    } else {
      dispatch(getTicketDetails(movieId));
    }
  }, [ticketId]);

  return (
    <>
      {isLoading === 'loading' ? (
        <LoadingSpinner />
      ) : (
        <WriteForm
          title={ticketId ? userTicketData.title : movieDetails.title}
          releaseYear={
            ticketId ? userTicketData.releaseYear : movieDetails.release_date
          }
          posterImage={
            ticketId ? userTicketData.posterImage : movieDetails.poster_path
          }
          rating={ticketId ? userTicketData.rating : ''}
          reviewText={ticketId ? userTicketData.reviewText : ''}
          ticketId={ticketId}
        />
      )}
    </>
  );
};

export default withHead(WritePage, '리뷰 작성');
