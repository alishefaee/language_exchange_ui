import React from "react";
import { AppBar, Toolbar, Box, Button, Typography, Container } from "@mui/material";

interface AuthShellProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
}

export const TypographicLogo: React.FC = () => (
  <Box
    component="a"
    href="/login"
    sx={{
      display: "inline-flex",
      alignItems: "center",
      textDecoration: "none",
      userSelect: "none",
      minHeight: "44px", // Enforces 44px touch target
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

export const AuthShell: React.FC<AuthShellProps> = ({ children, onLoginClick }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        backgroundColor: "#F8FAFC", // Canvas Base
        color: "#0F172A",
      }}
    >
      {/* Header: Logo on left, Login button on right */}
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

            <Button
              variant="outlined"
              href="/login"
              onClick={onLoginClick}
              sx={{
                fontWeight: 600,
                fontSize: "14px",
                px: 2,
              }}
            >
              Log in
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area: Centered Default Login Surface */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: "1rem",
          py: "1.5rem",
        }}
      >
        {children}
      </Box>

      {/* Simple Footer with Copyright Text */}
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
            color: "#64748B", // Muted Ink
            letterSpacing: "0.01em",
          }}
        >
          © {new Date().getFullYear()} LingoCollab. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};