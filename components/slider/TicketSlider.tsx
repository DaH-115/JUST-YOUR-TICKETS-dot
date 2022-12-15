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
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 760,
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
    ${({ theme }) => theme.device.tablet} {
      padding: 0 2rem;
    }

    ${({ theme }) => theme.device.desktop} {
      height: 85vh;
    }
  }

  .slick-arrow {
    margin: 0;
    padding: 0;
  }
`;
