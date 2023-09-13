import React from 'react';
import TopTenMovieTicket from 'components/ticket/top10-tickets/TopTenMovieTicket';
import TicketSlider from 'components/slider/TicketSlider';
import { TopTenMovieDataProps } from 'ticketType';

const TopTenMovieSlider = ({ movies }: { movies: TopTenMovieDataProps[] }) => {
  const movieLength = movies.length;

  return (
    <TicketSlider movieLength={movieLength}>
      {movies.map((item: TopTenMovieDataProps, index) => {
        return (
          <TopTenMovieTicket
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

export default React.memo(TopTenMovieSlider);
