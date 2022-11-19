import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
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
  device: {
    modile: `@media all and (max-width: 375px)`,
    tablet: `@media all and (min-width: 768px)`,
    desktop: `@media all and (min-width: 1024px)`,
  },
};
