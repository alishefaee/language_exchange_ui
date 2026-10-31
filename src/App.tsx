import React from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { minimalistTheme } from "./theme.ts";
import { AppRouter } from "./routers";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={minimalistTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;