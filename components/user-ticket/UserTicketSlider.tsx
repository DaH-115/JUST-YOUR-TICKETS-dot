import React from 'react';
import { UserTicketProps } from 'ticketType';
import TicketSlider from 'components/slider/TicketSlider';
import UserTicket from 'components/user-ticket/UserTicket';

const UserTicketSlider = ({ movies }: { movies: UserTicketProps[] }) => {
  const movieLength = movies.length;

  return (
    <TicketSlider movieLength={movieLength}>
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

export default React.memo(UserTicketSlider);
