import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { db } from 'firebase-config';
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import styled from 'styled-components';

import withHeadMeta from 'components/common/withHeadMeta';
import BackgroundStyle from 'components/layout/BackgroundStyle';
import UserTicketSlider from 'components/user-ticket/UserTicketSlider';
import SlideList from 'components/slider/SlideList';
import NoneResults from 'components/styles/NoneReults';
import { useAuthState } from 'components/store/auth-context';
import { UserTicketProps } from 'ticketType';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { LoadingSpinner } from 'components/common/LoadingSpinner';

const TicketListPage: NextPage = () => {
  const { userId } = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersTicket, setUsersTicket] = useState<UserTicketProps[]>([]);
  const ticketLength = usersTicket.length;
  // false -> desc / true -> asc
  const [isSorted, setIsSorted] = useState<boolean>(false);

  const onSortedHandler = useCallback(() => {
    setIsSorted((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const ticketRef = collection(db, 'users-tickets');
      const contentQuery = query(
        ticketRef,
        where('creatorId', '==', `${userId}`),
        orderBy('createdAt', `${!isSorted ? 'desc' : 'asc'}`)
      );
      const dbContents = await getDocs(contentQuery);

      const newData = dbContents.docs.map((item: DocumentData) => ({
        id: item.id,
        ...item.data(),
      }));

      setUsersTicket(newData);
      setIsLoading(false);
    })();
  }, [userId, isSorted]);

  return (
    <BackgroundStyle customMessage='your🍿'>
      <SlideList
        title='나의 티켓'
        ticketLength={ticketLength}
        description='나만의 감상티켓을 모아 보세요'
      >
        {isLoading ? (
          <Wrapper>
            <LoadingSpinner />
          </Wrapper>
        ) : (
          <TicketListWrapper>
            <SortList onClick={onSortedHandler}>
              <p>{'정렬'}</p>
              {!isSorted ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </SortList>
            {!ticketLength ? (
              <Wrapper>
                <NoneResults>{'아직 나의 티켓이 없습니다.'}</NoneResults>
              </Wrapper>
            ) : (
              <UserTicketSlider movies={usersTicket} />
            )}
          </TicketListWrapper>
        )}
      </SlideList>
    </BackgroundStyle>
  );
};

export default withHeadMeta(TicketListPage, '나의 티켓');

const SortList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 5.2rem;

  font-weight: 700;
  color: #fff;
  margin-top: 1rem;
  margin-left: ${({ theme }) => theme.space.small};
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
    margin-left: ${({ theme }) => theme.space.medium};
    font-size: 0.8rem;
  }
`;

const TicketListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  margin-top: 1rem;
`;
