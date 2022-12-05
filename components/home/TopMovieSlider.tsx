import MovieTicket from './TopMovieTicket';
import { popMovie } from '../../pages';
import TicketSlider from '../slider/TicketSlider';

const TopMovieSlider = ({ movies }: { movies: popMovie[] }) => {
  return (
    <TicketSlider>
      {movies.map((item: popMovie, index: number) => {
        return (
          <MovieTicket
            key={index}
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

export default TopMovieSlider;
