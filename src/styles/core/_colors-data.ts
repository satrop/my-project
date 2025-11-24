// Color configuration that mirrors the Sass color map
// This file is auto-generated from _colors.scss
// DO NOT EDIT MANUALLY - run 'pnpm run colors:sync' to regenerate
export const colors = {
  "teal": {
    "50": "#a3cccc",
    "100": "#76cccc",
    "150": "#10afaf",
    "200": "#009999",
    "250": "#167f8a",
    "300": "#006e79",
    "350": "#00535c",
    "400": "#005057",
    "15050": "#76cccc80",
    "15075": "#76ccccbf",
    "20050": "#009999b3"
  },
  "neutral": {
    "0": "#ffffff",
    "50": "#f4f0eb",
    "80": "#e9e1d7",
    "100": "#e4dcd3",
    "200": "#c1b2a5",
    "300": "#7b6f60",
    "400": "#615546",
    "600": "#363639",
    "800": "#000000"
  }
} as const;

export type ColorName = keyof typeof colors;
export type ColorShade<T extends ColorName> = keyof typeof colors[T];
export type ColorValue<T extends ColorName, S extends ColorShade<T>> = typeof colors[T][S];
