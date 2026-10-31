import React from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export const NotFoundView: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: "1.5rem",
          borderRadius: "1rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#2563EB",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Error 404
        </Typography>
        <Typography variant="h2" sx={{ color: "#0F172A" }}>
          Page not found
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B" }}>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          component={RouterLink}
          to={isAuthenticated ? "/discover" : "/login"}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: "0.5rem" }}
        >
          {isAuthenticated ? "Back to Discover" : "Go to Log in"}
        </Button>
      </Paper>
    </Box>
  );
};