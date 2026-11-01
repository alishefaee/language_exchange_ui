import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Link, Alert } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ApiError, ApiStatus } from "../../types/api";

export const LoginView: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError(null);

    try {
      const loggedInUser = await login({ email, password });
      if (loggedInUser.onboardingStep !== "completed") {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/discover", { replace: true });
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === ApiStatus.VALIDATION_FAILED && err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError("Unable to connect to the server.");
      }
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      height: "44px",
      backgroundColor: "#F8FAFC",
      borderRadius: "0.5rem",
      "& fieldset": { borderColor: "#E2E8F0" },
      "&:hover fieldset": { borderColor: "#94A3B8" },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": { borderColor: "#2563EB", borderWidth: "1px" },
      },
    },
    "& .MuiInputBase-input": {
      padding: "0 12px",
      fontSize: "15px",
      color: "#0F172A",
    },
  };

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
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: "400px",
          p: "1.5rem",
          borderRadius: "1rem",
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

        {generalError && (
          <Alert
            severity="error"
            sx={{
              borderRadius: "0.5rem",
              border: "1px solid #EF4444",
              backgroundColor: "#FEF2F2",
              color: "#991B1B",
              py: 0.5,
            }}
          >
            {generalError}
          </Alert>
        )}

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
            error={Boolean(fieldErrors.email?.length)}
            helperText={fieldErrors.email?.[0]}
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
            error={Boolean(fieldErrors.password?.length)}
            helperText={fieldErrors.password?.[0]}
            sx={inputStyles}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ mt: "0.5rem" }}
        >
          {isLoading ? "Signing in..." : "Log in"}
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
              component={RouterLink}
              to="/register"
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
    </Box>
  );
};