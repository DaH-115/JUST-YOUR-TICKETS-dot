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

import { UserTicketProps } from 'ticketType';
import withHeadMeta from 'components/common/withHeadMeta';
import UserTicketSlider from 'components/user-ticket/UserTicketSlider';
import SlideLayout from 'components/slider/SlideLayout';
import NoneResults from 'components/styles/NoneReults';
import { useAuthState } from 'components/store/auth-context';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const TicketListPage: NextPage = () => {
  const { userId } = useAuthState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersTicket, setUsersTicket] = useState<UserTicketProps[]>();
  const ticketLength = usersTicket && usersTicket.length;
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

      const userTickets = dbContents.docs.map((item: DocumentData) => ({
        id: item.id,
        ...item.data(),
      }));

      setUsersTicket(userTickets);
      setIsLoading(false);
    })();
  }, [userId, isSorted]);

  return (
    <BackgroundStyle>
      <SlideLayout
        title='나의 티켓'
        ticketLength={ticketLength}
        description='나만의 감상티켓을 모아 보세요'
      >
        <Wrapper>
          <SortListWrapper onClick={onSortedHandler}>
            <SoertListBtn>{'정렬'}</SoertListBtn>
            <SoertIconBtn>
              {!isSorted ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </SoertIconBtn>
          </SortListWrapper>
          {isLoading ? (
            <LoadingSpinner />
          ) : !usersTicket ? (
            <NoneResults>{'결과가 없습니다.'}</NoneResults>
          ) : (
            <UserTicketSlider movies={usersTicket} />
          )}
        </Wrapper>
      </SlideLayout>
    </BackgroundStyle>
  );
};

export default withHeadMeta(TicketListPage, '나의 티켓');

const Wrapper = styled.div`
  width: 100%;
  padding: 0 1rem;

  ${({ theme }) => theme.device.tablet} {
    padding: 0 2rem;
  }
`;

const BackgroundStyle = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.black};
`;

const SortListWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 5rem;
  color: #fff;
  font-weight: 700;
  border-radius: 1rem;
  border: 0.1rem solid ${({ theme }) => theme.colors.orange};

  padding: 0.5rem;
  margin: 1rem 0;
  cursor: pointer;

  &:hover,
  &:active {
    div {
      color: ${({ theme }) => theme.colors.orange};
      transition: color ease-in-out 200ms;
    }
  }
`;

const SoertListBtn = styled.div`
  font-size: 1rem;

  ${({ theme }) => theme.device.tablet} {
    font-size: 0.9rem;
  }
`;

const SoertIconBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.1rem;

  ${({ theme }) => theme.device.tablet} {
  }
`;
