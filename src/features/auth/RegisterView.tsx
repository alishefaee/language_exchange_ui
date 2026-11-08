// src/features/auth/RegisterView.tsx
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

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (password.length < 8) {
      setFieldErrors({ password: ["Password must be at least 8 characters long."] });
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: ["Passwords do not match."] });
      return;
    }

    try {
      await register({ email: trimmedEmail, password });
      navigate("/onboarding", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        }
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Registration failed. Please try again.");
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
            Create an account
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Join to start practicing languages with native speakers.
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
          autoComplete="new-password"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(fieldErrors.password?.length)}
          helperText={fieldErrors.password?.[0] || "Minimum 8 characters"}
          disabled={isLoading}
        />

        <TextField
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={Boolean(fieldErrors.confirmPassword?.length)}
          helperText={fieldErrors.confirmPassword?.[0]}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isLoading}
          sx={{ py: 1.25, fontWeight: 600 }}
        >
          {isLoading ? <CircularProgress size={22} color="inherit" /> : "Sign up"}
        </Button>

        <Typography variant="body2" sx={{ textAlign: "center", color: "#64748B" }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            sx={{ fontWeight: 600, color: "#2563EB" }}
          >
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};