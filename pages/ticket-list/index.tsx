import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { auth, db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import styled from 'styled-components';

import withHeadMeta from '../../components/common/withHeadMeta';
import BackgroundStyle from '../../components/layout/BackgroundStyle';
import UserTicketSlider from '../../components/user-ticket/UserTicketSlider';
import SlideList from '../../components/slider/SlideList';
import LoadingMsg from '../../components/common/LoadingMsg';
import { NoneResults } from '../search';
import { SystemError } from 'errorType';
import { UserTicketProps } from 'ticketType';
import Error from 'next/error';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const TicketListPage: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [usersTicket, setUsersTicket] = useState<UserTicketProps[]>([]);
  const ticketLength = usersTicket.length;
  const router = useRouter();
  // false -> desc / true -> asc
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const onSortedHandler = useCallback(() => {
    setIsSorted((prev) => !prev);
  }, []);

  useEffect(() => {
    try {
      (async () => {
        setIsLoading(true);

        const ticketRef = collection(db, 'users-tickets');
        const contentQuery = query(
          ticketRef,
          where('creatorId', '==', `${userId}`),
          orderBy('createdAt', `${!isSorted ? 'desc' : 'asc'}`)
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
      <Error statusCode={err.statusCode} />;
    }
  }, [userId, isSorted]);

  useEffect(() => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          router.push('/');
        }
      });
    } catch (error) {
      const err = error as SystemError;
      <Error statusCode={err.statusCode} />;
    }
  }, []);

  return (
    <BackgroundStyle customMessage='your🍿' backgroundColor='black'>
      {isLoading ? (
        <LoadingMsg />
      ) : (
        <SlideList title='나의 티켓' ticketLength={ticketLength}>
          <SortList onClick={onSortedHandler}>
            <p>{'정렬'}</p>
            {!isSorted ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </SortList>
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

const SortList = styled.div`
  position: absolute;
  top: 13.5rem;
  right: 1rem;

  display: flex;
  align-items: center;

  font-weight: 700;
  color: #fff;
  margin-left: 2rem;
  padding: 0.3rem 0.8rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 2rem;

  p {
    margin-right: 0.5rem;
  }

  ${({ theme }) => theme.device.tablet} {
    top: 17.5rem;
    right: 4rem;
  }
`;
