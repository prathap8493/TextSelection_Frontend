import { extendTheme } from "@chakra-ui/react";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = {
  heading: inter.style.fontFamily,
  body: inter.style.fontFamily,
};

export const theme = extendTheme({ config, fonts });
