import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "var(--font-rubik)",
    body: "var(--font-rubik)",
  },
  styles: {
    global: {
      body: {
        bg: "transparent",
        color: "white",
      },
    },
  },
  config: {
    useSystemColorMode: false,
    initialColorMode: "dark",
  },
});
