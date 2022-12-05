import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

import { StyledArrowNext, StyledArrowPrev } from '../styles/StyledArrow';

const TicketSlider = ({ children }: { children: React.ReactNode }) => {
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 2000,
    slidesToShow: 4,
    slidesToScroll: 2,
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
        breakpoint: 1299,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return <StyledSlider {...settings}>{children}</StyledSlider>;
};

export default TicketSlider;

const StyledSlider = styled(Slider)`
  .slick-list {
    width: 100%;
    padding: 0 1rem;

    ${({ theme }) => theme.device.tablet} {
      height: 100vh;
    }
  }

  .slick-arrow {
    margin: 0;
    padding: 0;
  }
`;
