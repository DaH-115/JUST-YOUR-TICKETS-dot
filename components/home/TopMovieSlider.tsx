import React from 'react';
import TopMovieTicket from './TopMovieTicket';
import TicketSlider from '../slider/TicketSlider';
import { TopMovieDataProps } from 'ticketType';

const TopMovieSlider = ({ movies }: { movies: TopMovieDataProps[] }) => {
  return (
    <TicketSlider>
      {movies.map((item: TopMovieDataProps, index) => {
        return (
          <TopMovieTicket
            key={item.id}
            movieId={item.id}
            movieIndex={index + 1}
            title={item.title}
            voteAverage={item.vote_average}
            releaseDate={item.release_date}
            posterPath={item.poster_path}
            overview={item.overview}
          />
        );
      })}
    </TicketSlider>
  );
};

export default React.memo(TopMovieSlider);
