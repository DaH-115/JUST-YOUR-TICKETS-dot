import { GetStaticProps, NextPage } from 'next';
import { collection, DocumentData, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

import BackgroundStyle from '../../components/BackgroundStyle';
import UserTicketList from '../../components/UserTicketList';

export interface usersTicketProps {
  id: string;
  title: string;
  releaseYear: string;
  rating: string;
  reviewText: string;
  posterImage: string;
}

const TicketListPage: NextPage<{ usersTicket: usersTicketProps[] }> = ({
  usersTicket,
}) => {
  return (
    <BackgroundStyle customMessage='your🍿' backgroundColor='black'>
      <UserTicketList movies={usersTicket} />
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
