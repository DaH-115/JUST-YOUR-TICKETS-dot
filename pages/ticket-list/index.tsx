import { GetStaticProps, NextPage } from 'next';
import { collection, DocumentData, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import BackgroundStyle from '../../components/Layout/BackgroundStyle';
import UserTicketSlider from '../../components/UserTicket/UserTicketSlider';
import SlideList from '../../components/SlideList';

export interface UserTicketProps {
  id?: string;
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
  return (
    <BackgroundStyle customMessage='your🍿' backgroundColor='black'>
      <SlideList title='나의 티켓'>
        <UserTicketSlider movies={usersTicket} />
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
