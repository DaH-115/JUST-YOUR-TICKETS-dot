import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

import {
  StyledArrowNext,
  StyledArrowPrev,
} from 'components/styles/StyledArrow';

const TicketSlider = ({
  children,
  movieLength,
}: {
  children: React.ReactNode;
  movieLength: number;
}) => {
  const breakLength = 4;

  const settings = {
    infinite: movieLength > breakLength,
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
        breakpoint: 1250,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 650,
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
      padding: 0 1.4rem;
    }
  }

  .slick-arrow {
    margin: 0;
    padding: 0;
  }
`;
