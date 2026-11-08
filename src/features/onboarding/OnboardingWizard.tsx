// src/features/onboarding/OnboardingWizard.tsx
import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

export const OnboardingWizard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 440,
          p: 4,
          borderRadius: "1rem",
          border: "1px solid #E2E8F0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A" }}>
          Onboarding
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          Signed in as <strong>{user?.email}</strong> ({user?.username})
        </Typography>
        <Button variant="outlined" onClick={logout} sx={{ alignSelf: "center", mt: 1 }}>
          Log out
        </Button>
      </Paper>
    </Box>
  );
};