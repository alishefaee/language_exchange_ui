// src/features/onboarding/AvatarUploader.tsx
import React, { useRef, useState } from "react";
import { Box, Avatar, Button, Typography, CircularProgress } from "@mui/material";
import { usersApi } from "../../api/users.api";
import { API_BASE_URL } from "../../api/client";

interface AvatarUploaderProps {
  avatarUrl: string;
  onUploadSuccess: (avatarUrl: string) => void;
  onError: (msg: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatarUrl,
  onUploadSuccess,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file (PNG, JPG, or WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError("Image size must be under 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Single-step upload directly to the backend host
      const { avatarUrl: uploadedPath } = await usersApi.uploadAvatar(
        file,
        (percent) => setUploadProgress(percent)
      );

      onUploadSuccess(uploadedPath);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Failed to upload avatar. You can try again or skip for now."
      );
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // If the backend returns a relative path (e.g. "/uploads/abc.jpg"), prepend API_BASE_URL
  const resolvedAvatarSrc =
    localPreview ||
    (avatarUrl
      ? avatarUrl.startsWith("http")
        ? avatarUrl
        : `${API_BASE_URL}${avatarUrl}`
      : undefined);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        p: "1rem",
        borderRadius: "0.75rem",
        backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    >
      <Box sx={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
        <Avatar
          src={resolvedAvatarSrc}
          sx={{
            width: 64,
            height: 64,
            backgroundColor: "#E2E8F0",
            color: "#0F172A",
            fontWeight: 700,
            fontSize: "20px",
            border: "1px solid #CBD5E1",
          }}
        >
          LC
        </Avatar>
        {isUploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(15, 23, 42, 0.45)",
              borderRadius: "9999px",
            }}
          >
            <CircularProgress
              variant={uploadProgress > 0 ? "determinate" : "indeterminate"}
              value={uploadProgress}
              size={28}
              sx={{ color: "#FFFFFF" }}
            />
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>
          Profile photo
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748B" }}>
          {isUploading
            ? `Uploading (${uploadProgress}%)...`
            : "JPG, PNG, or WebP up to 5MB."}
        </Typography>
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handleFileChange}
      />

      <Button
        variant="outlined"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        sx={{ fontSize: "13px", fontWeight: 600, px: 2 }}
      >
        {avatarUrl || localPreview ? "Change" : "Upload"}
      </Button>
    </Box>
  );
};