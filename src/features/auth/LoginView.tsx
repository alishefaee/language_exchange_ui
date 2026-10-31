import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Link } from "@mui/material";
import { AuthShell } from "../../components/layout/AuthShell";

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calls POST /api/v1/auth/login
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "44px",
      backgroundColor: "#F8FAFC",
      borderRadius: "0.5rem",
      "& fieldset": {
        borderColor: "#E2E8F0",
      },
      "&:hover fieldset": {
        borderColor: "#94A3B8",
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": {
          borderColor: "#2563EB",
          borderWidth: "1px",
        },
      },
    },
    "& .MuiInputBase-input": {
      padding: "0 12px",
      fontSize: "15px",
      color: "#0F172A",
    },
  };

  return (
    <AuthShell>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: "1.5rem",
          borderRadius: "1rem", // rounded-lg for cards
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Box sx={{ mb: "0.25rem" }}>
          <Typography variant="h2" sx={{ color: "#0F172A", mb: "0.25rem" }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Enter your credentials to access your language threads.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <Typography
            component="label"
            htmlFor="email"
            sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A", letterSpacing: "0.01em" }}
          >
            Email address
          </Typography>
          <TextField
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <Typography
            component="label"
            htmlFor="password"
            sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A", letterSpacing: "0.01em" }}
          >
            Password
          </Typography>
          <TextField
            id="password"
            type="password"
            placeholder="••••••••"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyles}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: "0.5rem" }}
        >
          Log in
        </Button>

        <Box
          sx={{
            pt: "0.75rem",
            borderTop: "1px solid #F1F5F9",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              underline="none"
              sx={{
                color: "#2563EB",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Create account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </AuthShell>
  );
};