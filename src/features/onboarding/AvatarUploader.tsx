// src/features/onboarding/AvatarUploader.tsx
import React, { useEffect, useRef, useState } from "react";
import { Box, Avatar, Button, Typography, CircularProgress } from "@mui/material";
import { usersApi } from "../../api/users.api";
import { API_BASE_URL } from "../../api/client";
import { compressAvatarImage } from "../../utils/imageCompressor";

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
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Clean up object URL on unmount or replacement
  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    // Reset input so selecting the same file again still triggers onChange
    e.target.value = "";
    if (!rawFile) return;

    if (!rawFile.type.startsWith("image/")) {
      onError("Please select a valid image file (PNG, JPG, or WebP).");
      return;
    }

    setIsCompressing(true);
    setUploadProgress(0);

    try {
      // 1. Compress & center-crop on client side before checking the 5MB upload limit
      const compressedFile = await compressAvatarImage(rawFile, {
        maxDimension: 512,
        quality: 0.82,
        outputType: "image/webp",
      });

      const previewUrl = URL.createObjectURL(compressedFile);
      setLocalPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return previewUrl;
      });

      setIsCompressing(false);
      setIsUploading(true);

      // 2. Upload compressed WebP file to POST /api/v1/users/avatar
      const { avatarUrl: uploadedPath } = await usersApi.uploadAvatar(
        compressedFile,
        (percent) => setUploadProgress(percent)
      );

      onUploadSuccess(uploadedPath);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Failed to process or upload avatar. You can try again or skip for now."
      );
      setLocalPreview(null);
    } finally {
      setIsCompressing(false);
      setIsUploading(false);
    }
  };

  const isBusy = isCompressing || isUploading;

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
        {isBusy && (
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
              variant={!isCompressing && uploadProgress > 0 ? "determinate" : "indeterminate"}
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
          {isCompressing
            ? "Optimizing image..."
            : isUploading
            ? `Uploading (${uploadProgress}%)...`
            : "JPG, PNG, or WebP (auto-compressed)."}
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
        disabled={isBusy}
        onClick={() => fileInputRef.current?.click()}
        sx={{ fontSize: "13px", fontWeight: 600, px: 2 }}
      >
        {avatarUrl || localPreview ? "Change" : "Upload"}
      </Button>
    </Box>
  );
};