import { createTheme, type MantineColorsTuple } from "@mantine/core";

// JLT Brand Colors
const jltBlue: MantineColorsTuple = [
  "#e8eaef",
  "#c7ccd9",
  "#a5aec4",
  "#8490af",
  "#62729a",
  "#405485",
  "#2b3550", // Main JLT Blue (#2b3550)
  "#1f2a3d",
  "#131e3d", // Dark JLT Blue (#131e3d)
  "#0a1123",
];

const jltYellow: MantineColorsTuple = [
  "#fff4e6",
  "#ffe8cc",
  "#ffd8a8",
  "#ffc078",
  "#ffb94d",
  "#ffa94d",
  "#ff9933", // Main JLT Yellow (#ff9933)
  "#e68a2e",
  "#cc7a29",
  "#b36b24",
];

export const theme = createTheme({
  /** Primary color - used for buttons, links, etc. */
  primaryColor: "jltBlue",

  /** Custom color scheme */
  colors: {
    jltBlue,
    jltYellow,
  },

  /** Font family */
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: { fontFamily: "Inter, sans-serif" },

  /** Default radius for all components */
  defaultRadius: "md",

  /** Component default props */
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },
    Card: {
      defaultProps: {
        radius: "lg",
        withBorder: true,
      },
    },
  },
});
