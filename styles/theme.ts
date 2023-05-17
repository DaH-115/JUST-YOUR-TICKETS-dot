import { DefaultTheme } from 'styled-components';

const size = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1300px',
};

const device = {
  mobile: `@media all and (max-width: ${size.mobile})`,
  tablet: `@media all and (min-width: ${size.tablet})`,
  desktop: `@media all and (min-width: ${size.desktop})`,
};

export const theme: DefaultTheme = {
  size,
  colors: {
    black: '#141414',
    gray: '#C2C2C2',
    orange: '#F68924',
    yellow: '#F6EE24',
  },
  scrollbarStyle: {
    scrollbarReset: `
      -ms-overflow-style: none; /* 인터넷 익스플로러 */
      scrollbar-width: none; /* 파이어폭스 */
      &::-webkit-scrollbar {
        display: none; /* 크롬, 사파리, 오페라, 엣지 */
    }`,
  },
  device,
  space: {
    small: '1rem',
    medium: '4rem',
    large: '6rem',
  },
  posterWidth: '320px',
  posterHeight: '480px',
};
