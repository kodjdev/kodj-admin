'use client';

import { createGlobalStyle } from 'styled-components';
import { themeColors } from '@/themes/themeColors';

// export const GlobalStyles = createGlobalStyle`
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   html {
//     font-size: 16px;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//   }

// body {
//     font-family: ${themeColors.typography.fontFamily.primary};
//     color: ${themeColors.colors.neutral.gray900};
//     background-color: ${themeColors.colors.neutral.gray50};
//     line-height: ${themeColors.typography.body.regular.lineHeight};
// }

//   h1, h2, h3, h4, h5, h6 {
//     font-weight: inherit;
//     line-height: inherit;
//   }

//   a {
//     color: inherit;
//     text-decoration: none;
//   }

//   button {
//     font-family: inherit;
//   }

//   input, textarea, select {
//     font-family: inherit;
//   }

//   #__next {
//     min-height: 100vh;
//   }
// `;

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${themeColors.typography.fontFamily.primary};
    color: #ffffff;
    background-color: #0a0a0a;
    line-height: ${themeColors.typography.body.regular.lineHeight};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: inherit;
    line-height: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  #__next {
    min-height: 100vh;
  }
`;
