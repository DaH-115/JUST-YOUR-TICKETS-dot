import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

import MovieTicket from './MovieTicket';
import { popMovie } from '../../pages';
import { StyledArrowNext, StyledArrowPrev } from '../styles/StyledArrow';

const TopMovieSlider = ({ movies }: { movies: popMovie[] }) => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: (
      <StyledArrowNext>
        <MdOutlineArrowForwardIos />
      </StyledArrowNext>
    ),
    prevArrow: (
      <StyledArrowPrev>
        <MdOutlineArrowBackIos />
      </StyledArrowPrev>
    ),
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <StyledSlider {...settings}>
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
    </StyledSlider>
  );
};

export default TopMovieSlider;

const StyledSlider = styled(Slider)`
  .slick-list {
    width: 100%;
    padding: 0 1rem;
  }

  .slick-arrow {
    margin: 0;
    padding: 0;
  }
`;
