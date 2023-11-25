import { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useAuthState } from 'store/auth-context';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getUserTickets } from 'store/userticketSlice';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import SlideLayout from 'components/slider/SlideLayout';
import withHead from 'components/common/withHead';

import { UserTicketProps } from 'ticketType';
import TicketSlider from 'components/slider/TicketSlider';
import UserTicket from 'components/ticket/user-ticket/UserTicket';

const TicketListPage: NextPage = () => {
  const { userId } = useAuthState();
  // false -> desc / true -> asc
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userTicketList = useAppSelector(
    (state) => state.userTicket.userTicketList
  );
  const ticketLength = userTicketList.length;
  const isLoading = useAppSelector((state) => state.userTicket.status);

  const onSortedHandler = useCallback(() => {
    setIsSorted((prev) => !prev);
  }, []);

  useEffect(() => {
    const user = {
      userId: userId,
      isSorted: isSorted,
    };

    dispatch(getUserTickets(user));
  }, [userId, isSorted, dispatch]);

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
          {isLoading === 'loading' ? (
            <LoadingSpinner />
          ) : !userTicketList.length ? (
            <NoneResults>{'결과가 없습니다.'}</NoneResults>
          ) : (
            <TicketSlider movieLength={userTicketList.length}>
              {userTicketList.map((item: UserTicketProps) => (
                <UserTicket
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  releaseYear={item.releaseYear}
                  rating={item.rating}
                  createdAt={item.createdAt}
                  reviewText={item.reviewText}
                  posterImage={item.posterImage}
                />
              ))}
            </TicketSlider>
          )}
        </Wrapper>
      </SlideLayout>
    </BackgroundStyle>
  );
};

export default withHead(TicketListPage, '나의 티켓');

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

const NoneResults = styled.p`
  width: 100%;
  height: 100vh;

  color: #fff;
  font-size: 1.2rem;
`;
