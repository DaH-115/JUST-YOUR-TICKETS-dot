import { GetStaticProps, NextPage } from 'next';
import { collection, DocumentData, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import BackgroundStyle from '../../components/layout/BackgroundStyle';
import UserTicketSlider from '../../components/user-ticket/UserTicketSlider';
import SlideList from '../../components/SlideList';
import { NoneResults } from '../search';

export interface UserTicketProps {
  id: string;
  title: string;
  releaseYear: string;
  rating: number | string;
  createdAt: number;
  reviewText: string;
  posterImage?: string;
}

const TicketListPage: NextPage<{ usersTicket: UserTicketProps[] }> = ({
  usersTicket,
}) => {
  const ticketLength = usersTicket.length;

  return (
    <BackgroundStyle customMessage='your🍿' backgroundColor='black'>
      <SlideList title='나의 티켓' ticketLength={ticketLength}>
        {ticketLength === 0 ? (
          <NoneResults>아직 나의 티켓이 없습니다.</NoneResults>
        ) : (
          <UserTicketSlider movies={usersTicket} />
        )}
      </SlideList>
    </BackgroundStyle>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const contentQuery = query(collection(db, 'users-tickets'));
  const dbContents = await getDocs(contentQuery);
  const dataArr: DocumentData[] = [];

  dbContents.forEach((item) => dataArr.push({ id: item.id, ...item.data() }));

  return {
    props: { usersTicket: dataArr },
  };
};

export default TicketListPage;
