import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      black: string;
      gray: string;
      orange: string;
      yellow: string;
    };
    scrollbarStyle: {
      scrollbarReset: string;
    };
    device: {
      modile: string;
      tablet: string;
      desktop: string;
    };
  }
}
