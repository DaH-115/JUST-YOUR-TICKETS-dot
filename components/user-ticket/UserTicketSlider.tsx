import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

import UserTicket from './UserTicket';
import { UserTicketProps } from '../../pages/ticket-list';
import { StyledArrowNext, StyledArrowPrev } from '../styles/StyledArrow';

const UserTicketSlider = ({ movies }: { movies: UserTicketProps[] }) => {
  const settings = {
    speed: 500,
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
    </StyledSlider>
  );
};

export default UserTicketSlider;

const StyledSlider = styled(Slider)`
  .slick-list {
    width: 100%;
    padding: 0 1rem;

    ${({ theme }) => theme.device.desktop} {
      height: 100vh;
    }
  }

  .slick-arrow {
    margin: 0;
    padding: 0;
  }
`;
