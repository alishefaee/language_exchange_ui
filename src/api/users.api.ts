// src/api/users.api.ts
import { apiClient, API_BASE_URL, tokenStorage } from "./client";
import { type ApiResponse, ApiStatus, type IUser } from "../types/api";

export type ProficiencyLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface OnboardingProfilePayload {
  dateOfBirth?: string;
  gender?: string;
  religion?: string;
  countryOfOrigin?: string;
  countryOfResidence?: string;
  nativeLanguages?: string[];
  learningLanguages?: Array<{ language: string; level: ProficiencyLevel }>;
  bio?: string;
  avatarUrl?: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string; // e.g., "/uploads/avatars/user91879756.webp" or full URL
}

export const usersApi = {
  /**
   * Uploads the avatar image directly to the backend host via multipart/form-data
   * with upload progress tracking.
   */
  uploadAvatar: (
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<AvatarUploadResponse> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("avatar", file);

      xhr.open("POST", `${API_BASE_URL}/api/v1/users/avatar`, true);

      const accessToken = tokenStorage.getAccessToken();
      if (accessToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      }

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        try {
          const body: ApiResponse<AvatarUploadResponse> = JSON.parse(xhr.responseText);
          if (
            xhr.status >= 200 &&
            xhr.status < 300 &&
            (body.status === ApiStatus.OK || body.status === ApiStatus.CREATED)
          ) {
            resolve(body.data);
          } else {
            reject(new Error(body.message || `Upload failed (${xhr.status})`));
          }
        } catch {
          reject(new Error("Invalid response from server during avatar upload"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during avatar upload"));
      xhr.send(formData);
    });
  },

  /**
   * Submits the onboarding profile and transitions user.onboardingStep to "completed"
   */
  submitOnboarding: (payload: OnboardingProfilePayload) =>
    apiClient<{ user: IUser }>("/api/v1/users/onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};