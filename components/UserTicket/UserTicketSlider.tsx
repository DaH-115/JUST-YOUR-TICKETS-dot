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
    height: 100%;
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

const StyledArrow = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;

  color: ${({ theme }) => theme.colors.yellow};
  border: 0.1rem solid white;
  border-radius: 50%;
  filter: drop-shadow(10px 10px 20px rgba(0, 0, 0, 1));

  text-align: center;
  line-height: 2.5rem;

  &:hover,
  &:active {
    color: #000;
    background-color: #fff;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.yellow};
  }

  &::before {
    display: none;
  }

  z-index: 999;
`;

// ⬅️ ➡️ ARROW BUTTON STYLE
const StyledArrowNext = styled(StyledArrow)`
  right: 2rem;
`;
const StyledArrowPrev = styled(StyledArrow)`
  left: 2rem;
`;
