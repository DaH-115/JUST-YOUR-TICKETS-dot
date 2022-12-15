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
import { Description } from '../../components/styles/Description';

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
    <BackgroundStyle customMessage='your🍿'>
      {isLoading ? (
        <LoadingMsg />
      ) : (
        <SlideList
          title='나의 티켓'
          ticketLength={ticketLength}
          description='나만의 감상티켓을 모아 보세요'
        >
          <SortList onClick={onSortedHandler}>
            <p>{'정렬'}</p>
            {!isSorted ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </SortList>
          {ticketLength === 0 ? (
            <>
              <NoneResults>{'아직 나의 티켓이 없습니다.'}</NoneResults>
              <Description>
                {'영화를 검색해서 나만의 감상 티켓을 만들어 보세요.'}
              </Description>
            </>
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
  top: 10.5rem;
  left: 12rem;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 5.2rem;

  font-weight: 700;
  color: #fff;
  margin-left: 2rem;
  padding: 0.3rem 0.8rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};
  border-radius: 2rem;

  cursor: pointer;

  &:hover,
  &:active {
    background: linear-gradient(
      transparent 60%,
      ${({ theme }) => theme.colors.orange}
    );
  }

  p {
    margin-right: 0.3rem;
  }

  ${({ theme }) => theme.device.tablet} {
    top: 12rem;
    left: 17rem;
    width: 5rem;
    font-size: 0.8rem;
  }

  ${({ theme }) => theme.device.desktop} {
    top: 14rem;
    left: 19rem;
  }
`;
