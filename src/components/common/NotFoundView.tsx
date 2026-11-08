// src/components/common/NotFoundView.tsx
import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export const NotFoundView: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

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
          maxWidth: 420,
          p: 4,
          borderRadius: "1rem",
          border: "1px solid #E2E8F0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, color: "#2563EB" }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
          Page not found
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(isAuthenticated ? "/onboarding" : "/login", { replace: true })}
          sx={{ mt: 1, alignSelf: "center", px: 3 }}
        >
          {isAuthenticated ? "Go to Onboarding" : "Back to Login"}
        </Button>
      </Paper>
    </Box>
  );
};