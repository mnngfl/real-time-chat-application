import { extendTheme, type ThemeConfig, withDefaultColorScheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
  disableTransitionOnChange: false,
};

const theme = extendTheme(
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Button"],
  }),
  {
    config,
    colors: {
      brand: {
        50: "rgb(229,237,255)",
        100: "rgb(199,221,254)",
        200: "rgb(143,188,254)",
        300: "rgb(84,156,255)",
        400: "rgb(37,127,233)",
        500: "rgb(13,99,194)",
        600: "rgb(8,76,147)",
        700: "rgb(5,55,105)",
        800: "rgb(2,37,70)",
        900: "rgb(1,22,41)",
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          default: "rgb(54 97 142)",
          _dark: "rgb(160 202 253)",
        },
        "on-primary": {
          default: "rgb(255 255 255)",
          _dark: "rgb(0 50 88)",
        },
        "primary-container": {
          default: "rgb(209 228 255)",
          _dark: "rgb(26 73 117)",
        },
        "on-primary-container": {
          default: "rgb(0 29 54)",
          _dark: "rgb(209 228 255)",
        },
        "inverse-primary": {
          default: "rgb(160 202 253)",
          _dark: "rgb(54 97 142)",
        },
        secondary: {
          default: "rgb(83 95 112)",
          _dark: "rgb(187 199 219)",
        },
        "on-secondary": {
          default: "rgb(255 255 255)",
          _dark: "rgb(37 49 64)",
        },
        "secondary-container": {
          default: "rgb(215 227 248)",
          _dark: "rgb(59 72 88)",
        },
        "on-secondary-container": {
          default: "rgb(16 28 43)",
          _dark: "rgb(215 227 248)",
        },
        tertiary: {
          default: "rgb(107 87 120)",
          _dark: "rgb(215 190 228)",
        },
        "on-tertiary": {
          default: "rgb(255 255 255)",
          _dark: "rgb(59 41 72)",
        },
        "tertiary-container": {
          default: "rgb(243 218 255)",
          _dark: "rgb(82 63 95)",
        },
        "on-tertiary-container": {
          default: "rgb(37 20 49)",
          _dark: "rgb(243 218 255)",
        },
        "surface-variant": {
          default: "rgb(223 226 235)",
          _dark: "rgb(67 71 78)",
        },
        "on-surface-variant": {
          default: "rgb(67 71 78)",
          _dark: "rgb(195 198 207)",
        },
        background: {
          default: "rgb(248 249 255)",
          _dark: "rgb(17 20 24)",
        },
        "on-background": {
          default: "rgb(25 28 32)",
          _dark: "rgb(225 226 232)",
        },
        outline: {
          default: "rgb(115 119 127)",
          _dark: "rgb(141 145 153)",
        },
        "outline-variant": {
          default: "rgb(195 198 207)",
          _dark: "rgb(67 71 78)",
        },
      },
    },
    components: {
      Button: {
        defaultProps: {
          colorScheme: "brand",
        },
      },
    },
  }
);

export default theme;
