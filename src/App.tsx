import React from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme.ts";
import { AuthProvider } from "./hooks/useAuth";
import { AppRouter } from "./routers";

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;