import { NextPage } from 'next';
import MovieDetailPage from '../../components/movie-detail/MovieDetailPage';
import UserTicketDetailPage from '../../components/user-ticket-detail/UserTicketDetailPage';

const TicketListDetailPage: NextPage = () => {
  return <UserTicketDetailPage />;
};

export default TicketListDetailPage;
