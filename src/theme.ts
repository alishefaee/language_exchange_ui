import { createTheme } from "@mui/material/styles";

export const minimalistTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F172A", // Primary Ink
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2563EB", // Interactive Accent (Cobalt)
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#EF4444", // Correction Red
    },
    success: {
      main: "#10B981", // Grammar Green
    },
    background: {
      default: "#F8FAFC", // Canvas Base
      paper: "#FFFFFF",   // Surface / Paper
    },
    text: {
      primary: "#0F172A",   // Primary Ink
      secondary: "#64748B", // Muted Ink
    },
    divider: "#E2E8F0",     // Universal 1px structural border
  },
  shape: {
    borderRadius: 8, // 0.5rem default for controls & inputs
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontSize: "30px", fontWeight: 700, lineHeight: "38px", letterSpacing: "-0.02em" },
    h2: { fontSize: "20px", fontWeight: 600, lineHeight: "28px", letterSpacing: "-0.02em" },
    h3: { fontSize: "16px", fontWeight: 600, lineHeight: "24px", letterSpacing: "-0.01em" },
    body1: { fontSize: "16px", fontWeight: 400, lineHeight: "24px" },
    body2: { fontSize: "15px", fontWeight: 400, lineHeight: "22px" }, // Baseline body-md
    caption: { fontSize: "13px", fontWeight: 400, lineHeight: "18px" }, // body-sm
    button: { fontSize: "14px", fontWeight: 600, lineHeight: "20px", textTransform: "none", letterSpacing: "0.01em" },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          minHeight: "44px",
          minWidth: "44px",
          padding: "10px 16px",
          borderRadius: "0.5rem",
          transition: "background-color 120ms ease, border-color 120ms ease",
        },
        containedPrimary: {
          backgroundColor: "#0F172A",
          "&:hover": { backgroundColor: "#1E293B" },
          "&:active": { backgroundColor: "#1E293B" },
        },
        containedSecondary: {
          backgroundColor: "#2563EB",
          "&:hover": { backgroundColor: "#1D4ED8" },
          "&:active": { backgroundColor: "#1D4ED8" },
        },
        outlined: {
          backgroundColor: "#FFFFFF",
          borderColor: "#E2E8F0",
          color: "#0F172A",
          "&:hover": {
            backgroundColor: "#F8FAFC",
            borderColor: "#94A3B8",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
        },
      },
    },
  },
});