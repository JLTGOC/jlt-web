import { createTheme, type MantineColorsTuple } from "@mantine/core";

// ============================================
// JLT Brand Colors
// ============================================

// JLT Blue: #1D274E — primary brand color
const jltBlue: MantineColorsTuple = [
  "#eceef5", // 0 - very light tint
  "#d4d8ea", // 1
  "#b8bedd", // 2
  "#9aa4cf", // 3
  "#7c8ac2", // 4 - lighter shade
  "#5e70b5", // 5
  "#3d5098", // 6 - hover
  "#2d3d7a", // 7 - active / pressed
  "#1D274E", // 8 - MAIN brand blue
  "#131a38", // 9 - darkest
];

// JLT Orange: #FF9933 — accent / CTA color
const jltOrange: MantineColorsTuple = [
  "#fff4e6", // 0 - very light tint
  "#ffe8cc", // 1
  "#ffd8a0", // 2
  "#ffc470", // 3
  "#ffb347", // 4 - lighter shade
  "#FF9933", // 5 - MAIN brand orange
  "#e6891f", // 6 - hover
  "#cc7a1a", // 7 - active / pressed
  "#b36a15", // 8
  "#7a4a0e", // 9 - darkest
];

// JLT Accent: #4E6174 — secondary/muted UI color
const jltAccent: MantineColorsTuple = [
  "#eef1f4", // 0 - very light tint
  "#d9e0e7", // 1
  "#c1ccd6", // 2
  "#a8b8c5", // 3
  "#8fa3b4", // 4 - lighter shade
  "#768fa3", // 5
  "#617a8e", // 6 - hover
  "#4E6174", // 7 - MAIN accent color
  "#3b4d5c", // 8 - active / pressed
  "#283845", // 9 - darkest
];

// ============================================
// Theme
// ============================================

export const theme = createTheme({
  /** Primary color */
  primaryColor: "jltBlue",
  primaryShade: { light: 8, dark: 6 },

  /** Custom colors */
  colors: {
    jltBlue,
    jltOrange,
    jltAccent,
  },

  /** Typography */
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  headings: {
    fontFamily: "Inter, sans-serif",
    fontWeight: "700",
  },

  /** Base font sizes — Mantine defaults preserved, extended with 2xl+ */
  fontSizes: {
    xs: "0.75rem", // 12px  (Mantine default)
    sm: "0.875rem", // 14px  (Mantine default)
    md: "1rem", // 16px  (Mantine default)
    lg: "1.125rem", // 18px  (Mantine default)
    xl: "1.25rem", // 20px  (Mantine default)
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  /** Line heights */
  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },

  /** Default radius */
  defaultRadius: "md",

  /** Component defaults */
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },

    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },

    PasswordInput: {
      defaultProps: {
        radius: "md",
      },
    },

    Select: {
      defaultProps: {
        radius: "md",
      },
    },

    MultiSelect: {
      defaultProps: {
        radius: "md",
      },
    },

    Textarea: {
      defaultProps: {
        radius: "md",
      },
    },

    NumberInput: {
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

    Badge: {
      defaultProps: {
        radius: "sm",
      },
    },
  },
});
