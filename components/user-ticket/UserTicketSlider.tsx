import TicketSlider from '../slider/TicketSlider';
import UserTicket from './UserTicket';
import { UserTicketProps } from 'ticketType';

const UserTicketSlider = ({ movies }: { movies: UserTicketProps[] }) => {
  return (
    <TicketSlider>
      {movies.map((item: UserTicketProps) => {
        return (
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
        );
      })}
    </TicketSlider>
  );
};

export default UserTicketSlider;
