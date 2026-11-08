// src/features/onboarding/OnboardingWizard.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MobileStepper,
  Autocomplete,
  Chip,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import {
  usersApi,
  ProficiencyLevel,
  OnboardingProfilePayload,
} from "../../api/users.api";
import { ApiError, ApiStatus } from "../../types/api";
import {
  ISO_COUNTRIES,
  LANGUAGES_LIST,
  CEFR_LEVELS,
  GENDER_OPTIONS,
  CountryOption,
} from "./onboardingConstants";
import { AvatarUploader } from "./AvatarUploader";

const STEP_TITLES = [
  {
    label: "Step 1 of 4 · Demographics",
    title: "Basic details",
    subtitle: "Help language partners find common ground with you. All fields are optional.",
  },
  {
    label: "Step 2 of 4 · Geography",
    title: "Where are you from?",
    subtitle: "Share your country of origin and where you currently live.",
  },
  {
    label: "Step 3 of 4 · Languages",
    title: "Your languages",
    subtitle: "Select the languages you speak natively and the ones you are practicing.",
  },
  {
    label: "Step 4 of 4 · Bio & Avatar",
    title: "Introduce yourself",
    subtitle: "Add a short bio and profile photo so partners know who they are chatting with.",
  },
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Step 1: Demographics State
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [religion, setReligion] = useState<string>("");

  // Step 2: Geography State
  const [countryOfOrigin, setCountryOfOrigin] = useState<CountryOption | null>(null);
  const [countryOfResidence, setCountryOfResidence] = useState<CountryOption | null>(null);

  // Step 3: Languages State
  const [nativeLanguages, setNativeLanguages] = useState<string[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<
    Record<string, ProficiencyLevel>
  >({});

  // Step 4: Bio & Avatar State
  const [bio, setBio] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      minHeight: "44px",
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
      fontSize: "15px",
      color: "#0F172A",
    },
  };

  const toggleNativeLanguage = (code: string) => {
    setNativeLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleLearningLanguage = (code: string) => {
    setLearningLanguages((prev) => {
      const next = { ...prev };
      if (next[code]) {
        delete next[code];
      } else {
        next[code] = "B1"; // Default CEFR level when toggled on
      }
      return next;
    });
  };

  const setLanguageProficiency = (code: string, level: ProficiencyLevel) => {
    setLearningLanguages((prev) => ({
      ...prev,
      [code]: level,
    }));
  };

  const buildPayload = (): OnboardingProfilePayload => {
    const payload: OnboardingProfilePayload = {};

    if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
    if (gender) payload.gender = gender;
    if (religion.trim()) payload.religion = religion.trim();
    if (countryOfOrigin) payload.countryOfOrigin = countryOfOrigin.code;
    if (countryOfResidence) payload.countryOfResidence = countryOfResidence.code;
    if (nativeLanguages.length > 0) payload.nativeLanguages = nativeLanguages;

    const learningArray = Object.entries(learningLanguages).map(
      ([language, level]) => ({ language, level })
    );
    if (learningArray.length > 0) payload.learningLanguages = learningArray;

    if (bio.trim()) payload.bio = bio.trim();
    if (avatarUrl) payload.avatarUrl = avatarUrl;

    return payload;
  };

  const handleCompleteOnboarding = async (skipAll = false) => {
    setIsSubmitting(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const payload = skipAll ? {} : buildPayload();
      const response = await usersApi.submitOnboarding(payload);

      updateUser({
        ...response?.user,
        onboardingStep: "completed",
      });

      navigate("/discover", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === ApiStatus.VALIDATION_FAILED && err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        } else {
          setGeneralError(err.message);
        }
      } else {
        setGeneralError("Unable to save onboarding profile. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (activeStep < STEP_TITLES.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      handleCompleteOnboarding(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const currentHeader = STEP_TITLES[activeStep];

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: "1rem",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "480px", // Constrained mobile-first shell per spec
          p: { xs: "1.25rem", sm: "1.5rem" },
          borderRadius: "1rem",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Top Bar: Step Indicator & Prominent "Skip for now" Action */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: "0.75rem",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#2563EB",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {currentHeader.label}
          </Typography>

          <Button
            variant="text"
            disabled={isSubmitting}
            onClick={() => handleCompleteOnboarding(false)}
            sx={{
              minHeight: "36px",
              px: 1.5,
              py: 0.5,
              fontSize: "13px",
              fontWeight: 600,
              color: "#64748B",
              "&:hover": {
                color: "#0F172A",
                backgroundColor: "#F1F5F9",
              },
            }}
          >
            Skip for now
          </Button>
        </Box>

        {/* Step Title & Description */}
        <Box>
          <Typography variant="h2" sx={{ color: "#0F172A", mb: "0.25rem" }}>
            {currentHeader.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            {currentHeader.subtitle}
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

        {/* STEP 1: DEMOGRAPHICS */}
        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Typography
                component="label"
                htmlFor="dob"
                sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}
              >
                Date of birth
              </Typography>
              <TextField
                id="dob"
                type="date"
                fullWidth
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                error={Boolean(fieldErrors.dateOfBirth?.length)}
                helperText={fieldErrors.dateOfBirth?.[0]}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Typography
                component="label"
                htmlFor="gender"
                sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}
              >
                Gender
              </Typography>
              <TextField
                id="gender"
                select
                fullWidth
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                error={Boolean(fieldErrors.gender?.length)}
                helperText={fieldErrors.gender?.[0]}
                SelectProps={{ displayEmpty: true }}
                sx={inputStyles}
              >
                <MenuItem value="">
                  <Typography sx={{ color: "#64748B", fontSize: "15px" }}>
                    Select gender (optional)
                  </Typography>
                </MenuItem>
                {GENDER_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Typography
                component="label"
                htmlFor="religion"
                sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}
              >
                Religion or worldview (optional)
              </Typography>
              <TextField
                id="religion"
                placeholder="e.g., Secular, Buddhist, Christian, Muslim..."
                fullWidth
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                error={Boolean(fieldErrors.religion?.length)}
                helperText={fieldErrors.religion?.[0]}
                sx={inputStyles}
              />
            </Box>
          </Box>
        )}

        {/* STEP 2: GEOGRAPHY */}
        {activeStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}>
                Country of origin
              </Typography>
              <Autocomplete
                options={ISO_COUNTRIES}
                value={countryOfOrigin}
                onChange={(_, newValue) => setCountryOfOrigin(newValue)}
                getOptionLabel={(option) => `${option.flag}  ${option.name}`}
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search country of origin..."
                    error={Boolean(fieldErrors.countryOfOrigin?.length)}
                    helperText={fieldErrors.countryOfOrigin?.[0]}
                    sx={inputStyles}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}>
                Country of residence
              </Typography>
              <Autocomplete
                options={ISO_COUNTRIES}
                value={countryOfResidence}
                onChange={(_, newValue) => setCountryOfResidence(newValue)}
                getOptionLabel={(option) => `${option.flag}  ${option.name}`}
                isOptionEqualToValue={(opt, val) => opt.code === val.code}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search current country of residence..."
                    error={Boolean(fieldErrors.countryOfResidence?.length)}
                    helperText={fieldErrors.countryOfResidence?.[0]}
                    sx={inputStyles}
                  />
                )}
              />
            </Box>
          </Box>
        )}

        {/* STEP 3: LANGUAGES */}
        {activeStep === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Native Languages */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>
                Native languages
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {LANGUAGES_LIST.map((lang) => {
                  const isSelected = nativeLanguages.includes(lang.code);
                  return (
                    <Chip
                      key={`native-${lang.code}`}
                      label={`${lang.flag} ${lang.name}`}
                      onClick={() => toggleNativeLanguage(lang.code)}
                      sx={{
                        height: "36px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                        color: isSelected ? "#2563EB" : "#0F172A",
                        border: isSelected
                          ? "1px solid #2563EB"
                          : "1px solid #E2E8F0",
                        "&:hover": {
                          backgroundColor: isSelected ? "#DBEAFE" : "#F8FAFC",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Learning Languages + CEFR Proficiency Selector */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>
                Languages you are learning
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {LANGUAGES_LIST.map((lang) => {
                  const selectedLevel = learningLanguages[lang.code];
                  const isSelected = Boolean(selectedLevel);
                  return (
                    <Chip
                      key={`learning-${lang.code}`}
                      label={
                        isSelected
                          ? `${lang.flag} ${lang.name} · ${selectedLevel}`
                          : `${lang.flag} ${lang.name}`
                      }
                      onClick={() => toggleLearningLanguage(lang.code)}
                      sx={{
                        height: "36px",
                        borderRadius: "9999px",
                        fontSize: "12px",
                        fontWeight: 500,
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                        color: isSelected ? "#2563EB" : "#0F172A",
                        border: isSelected
                          ? "1px solid #2563EB"
                          : "1px solid #E2E8F0",
                        "&:hover": {
                          backgroundColor: isSelected ? "#DBEAFE" : "#F8FAFC",
                        },
                      }}
                    />
                  );
                })}
              </Box>

              {/* Active CEFR Level Pickers */}
              {Object.keys(learningLanguages).length > 0 && (
                <Box
                  sx={{
                    mt: "0.5rem",
                    p: "0.75rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  <Typography
                    sx={{ fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase" }}
                  >
                    Select CEFR Proficiency (A1 – C2)
                  </Typography>
                  {Object.entries(learningLanguages).map(([code, currentLevel]) => {
                    const langObj = LANGUAGES_LIST.find((l) => l.code === code);
                    if (!langObj) return null;
                    return (
                      <Box
                        key={`cefr-${code}`}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>
                          {langObj.flag} {langObj.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: "0.25rem" }}>
                          {CEFR_LEVELS.map((lvl) => {
                            const active = currentLevel === lvl;
                            return (
                              <Chip
                                key={lvl}
                                label={lvl}
                                size="small"
                                onClick={() => setLanguageProficiency(code, lvl)}
                                sx={{
                                  height: "28px",
                                  borderRadius: "9999px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  backgroundColor: active ? "#2563EB" : "#FFFFFF",
                                  color: active ? "#FFFFFF" : "#64748B",
                                  border: active
                                    ? "1px solid #2563EB"
                                    : "1px solid #E2E8F0",
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* STEP 4: BIO & AVATAR */}
        {activeStep === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AvatarUploader
              avatarUrl={avatarUrl}
              onUploadSuccess={(url) => {
                setAvatarUrl(url);
                setGeneralError(null);
              }}
              onError={(msg) => setGeneralError(msg)}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  component="label"
                  htmlFor="bio"
                  sx={{ fontSize: "12px", fontWeight: 500, color: "#0F172A" }}
                >
                  Short bio
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  {bio.length}/500
                </Typography>
              </Box>
              <TextField
                id="bio"
                multiline
                minRows={4}
                maxRows={6}
                placeholder="Share your language goals, hobbies, or preferred conversation topics..."
                fullWidth
                inputProps={{ maxLength: 500 }}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                error={Boolean(fieldErrors.bio?.length)}
                helperText={fieldErrors.bio?.[0]}
                sx={{
                  ...inputStyles,
                  "& .MuiOutlinedInput-root": {
                    ...inputStyles["& .MuiOutlinedInput-root"],
                    p: "12px",
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Bottom Stepper & Navigation Controls */}
        <Box
          sx={{
            pt: "0.75rem",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <MobileStepper
            variant="dots"
            steps={STEP_TITLES.length}
            position="static"
            activeStep={activeStep}
            sx={{
              p: 0,
              backgroundColor: "transparent",
              justifyContent: "center",
              "& .MuiMobileStepper-dot": {
                backgroundColor: "#E2E8F0",
                mx: "4px",
              },
              "& .MuiMobileStepper-dotActive": {
                backgroundColor: "#2563EB",
              },
            }}
            nextButton={<span />}
            backButton={<span />}
          />

          <Box sx={{ display: "flex", gap: "0.75rem" }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
            )}

            <Button
              variant="contained"
              color={activeStep === STEP_TITLES.length - 1 ? "secondary" : "primary"}
              onClick={handleNext}
              disabled={isSubmitting}
              sx={{ flex: 2 }}
            >
              {isSubmitting
                ? "Saving profile..."
                : activeStep === STEP_TITLES.length - 1
                ? "Complete setup"
                : "Continue"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};