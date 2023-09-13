import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from 'react-icons/md';

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
        breakpoint: 1300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return <Slider {...settings}>{children}</Slider>;
};
export default TicketSlider;

const StyledArrow = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  line-height: 2.5rem;
  text-align: center;

  color: #fff;
  border: 0.1rem solid #fff;
  border-radius: 50%;

  &:hover,
  &:active {
    color: #fff;
    background-color: ${({ theme }) => theme.colors.orange};
    border-color: ${({ theme }) => theme.colors.orange};
    transition: all ease-in-out 200ms;
  }

  &::before {
    display: none;
  }

  z-index: 999;
`;

// ARROW BUTTON STYLE
const StyledArrowNext = styled(StyledArrow)`
  right: 2rem;
`;
const StyledArrowPrev = styled(StyledArrow)`
  left: 2rem;
`;
