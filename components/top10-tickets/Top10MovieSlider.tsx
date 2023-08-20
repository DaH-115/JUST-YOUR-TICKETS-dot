import React from 'react';
import Top10MovieTicket from 'components/top10-tickets/Top10MovieTicket';
import TicketSlider from 'components/slider/TicketSlider';
import { Top10MovieDataProps } from 'ticketType';

const Top10MovieSlider = ({ movies }: { movies: Top10MovieDataProps[] }) => {
  const movieLength = movies.length;

  return (
    <TicketSlider movieLength={movieLength}>
      {movies.map((item: Top10MovieDataProps, index) => {
        return (
          <Top10MovieTicket
            key={item.id}
            movieId={item.id}
            movieIndex={index + 1}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
          />
        );
      })}
    </TicketSlider>
  );
};

export default React.memo(Top10MovieSlider);
