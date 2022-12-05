import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { auth, db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import withHeadMeta from '../../components/common/withHeadMeta';
import BackgroundStyle from '../../components/layout/BackgroundStyle';
import UserTicketSlider from '../../components/user-ticket/UserTicketSlider';
import SlideList from '../../components/slider/SlideList';
import LoadingMsg from '../../components/common/LoadingMsg';
import { NoneResults } from '../search';
import { SystemError } from 'errorType';

export interface UserTicketProps {
  id: string;
  title: string;
  releaseYear: string;
  rating: number | string;
  createdAt: number;
  reviewText: string;
  posterImage?: string;
}

const TicketListPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [usersTicket, setUsersTicket] = useState<UserTicketProps[]>([]);
  const ticketLength = usersTicket.length;

  useEffect(() => {
    try {
      (async () => {
        setIsLoading(true);

        const ticketRef = collection(db, 'users-tickets');
        const contentQuery = query(
          ticketRef,
          where('creatorId', '==', `${userId}`),
          orderBy('createdAt', 'asc')
        );
        const dbContents = await getDocs(contentQuery);

        const newData = dbContents.docs.map((item: any) => ({
          id: item.id,
          ...item.data(),
        }));

        setUsersTicket(newData);
        setIsLoading(false);
      })();
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  }, [userId]);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          console.log('user is signed out');
        }
      });
    } catch (error) {
      const err = error as SystemError;
      console.log(err.message);
    }
  }, []);

  return (
    <BackgroundStyle customMessage='your🍿' backgroundColor='black'>
      {isLoading ? (
        <LoadingMsg />
      ) : (
        <SlideList title='나의 티켓' ticketLength={ticketLength}>
          {ticketLength === 0 ? (
            <NoneResults>아직 나의 티켓이 없습니다.</NoneResults>
          ) : (
            <UserTicketSlider movies={usersTicket} />
          )}
        </SlideList>
      )}
    </BackgroundStyle>
  );
};

export default withHeadMeta(TicketListPage, '나의 티켓');
