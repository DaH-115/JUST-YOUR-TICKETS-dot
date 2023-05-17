import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    size: {
      mobile: string;
      tablet: string;
      desktop: string;
    };
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
      mobile: string;
      tablet: string;
      desktop: string;
    };
    space: {
      small: string;
      medium: string;
      large: string;
    };
    posterWidth: string;
    posterHeight: string;
  }
}
