import { MadocTheme } from "@madoc.io/types/dist/frontend/themes/definitions/types";

const theme: MadocTheme = {
  header: 'default',
  global: 'default',
  accent: 'default',
  footer: 'dark',
  siteContainer: 'dark',
  custom: {
    header: {
      headerBackground: 'blue'
    },
    global: {
      maxWidth: '1200px',
    },
  },
};

export const exampleTheme = {
  id: 'madoc-plugin-theme',
  name: 'Madoc plugin theme',
  version: '1.0.0',
  description: 'This is my theme loaded from a plugin',
  thumbnail: 'https://user-images.githubusercontent.com/8266711/118507448-25750b80-b726-11eb-9f87-d96f43c0a894.png',
  theme,
};
