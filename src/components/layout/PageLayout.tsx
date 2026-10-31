import React from "react";
import { Outlet, Link as RouterLink, useLocation } from "react-router";
import { AppBar, Toolbar, Box, Button, Typography, Container } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const TypographicLogo: React.FC = () => (
  <Box
    component={RouterLink}
    to="/"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none",
      userSelect: "none",
      minHeight: "44px",
    }}
  >
    <Typography
      component="span"
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontSize: { xs: "20px", sm: "22px" },
        fontWeight: 700,
        letterSpacing: "-0.03em",
        color: "#0F172A",
      }}
    >
      lingo
    </Typography>
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: "6px",
        height: "6px",
        borderRadius: "9999px",
        backgroundColor: "#2563EB",
        mx: "4px",
        mb: "2px",
      }}
    />
    <Typography
      component="span"
      sx={{
        fontFamily: "'Inter', sans-serif",
        fontSize: { xs: "20px", sm: "22px" },
        fontWeight: 500,
        letterSpacing: "-0.02em",
        color: "#64748B",
      }}
    >
      collab
    </Typography>
  </Box>
);

export const PageLayout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh", // Dynamic viewport lock per spec
        backgroundColor: "#F8FAFC", // Canvas Base
        color: "#0F172A",
      }}
    >
      {/* Persistent Header */}
      <AppBar position="static">
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: "1rem", md: "2rem" } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: "64px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TypographicLogo />

            {!isAuthenticated ? (
              <Button
                component={RouterLink}
                to="/login"
                variant={location.pathname === "/login" ? "contained" : "outlined"}
                color="primary"
                sx={{ fontWeight: 600, fontSize: "14px", px: 2 }}
              >
                Log in
              </Button>
            ) : (
              <Button
                onClick={logout}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "14px", px: 2 }}
              >
                Log out
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Dynamic Page Section (Swapped by Router) */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: "1rem", md: "2rem" },
          py: "1.5rem",
        }}
      >
        <Outlet />
      </Box>

      {/* Persistent Simple Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E2E8F0",
          py: "1rem",
          px: { xs: "1rem", md: "2rem" },
          textAlign: "center",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#64748B",
            letterSpacing: "0.01em",
          }}
        >
          © {new Date().getFullYear()} LingoCollab. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};