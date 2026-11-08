// src/features/auth/LoginView.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ApiError } from "../../types/api";

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    try {
      await login({ email: trimmedEmail, password });
      navigate("/onboarding", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        }
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unable to sign in right now. Please try again.");
      }
    }
  };

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
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: "1rem",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Sign in to connect with your language partners.
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ borderRadius: "0.5rem" }}>
            {errorMessage}
          </Alert>
        )}

        <TextField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(fieldErrors.email?.length)}
          helperText={fieldErrors.email?.[0]}
          disabled={isLoading}
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(fieldErrors.password?.length)}
          helperText={fieldErrors.password?.[0]}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ py: 1.25, fontWeight: 600 }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Log in"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", color: "#64748B" }}>
          Don&apos;t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            sx={{ fontWeight: 600, color: "#2563EB" }}
          >
            Create one
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}; 