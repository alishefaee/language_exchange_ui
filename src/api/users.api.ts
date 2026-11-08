// src/api/users.api.ts
import { apiClient, API_BASE_URL, tokenStorage } from "./client";
import { type ApiResponse, ApiStatus, type IUser } from "../types/api";

export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "fluent"
  | "native";

export type GenderType =
  | "male"
  | "female"
  | "non-binary"
  | "other"
  | "prefer_not_to_say";

export interface LanguageProficiencyEntry {
  languageCode: string;
  proficiency: ProficiencyLevel;
}

export interface OnboardingProfilePayload {
  dateOfBirth?: string;
  gender?: GenderType;
  religion?: string;
  countryOfOrigin?: string;
  countryOfResidence?: string;
  nativeLanguages?: LanguageProficiencyEntry[];
  learningLanguages?: LanguageProficiencyEntry[];
  bio?: string;
  avatarUrl?: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
  avatarUri?: string;
}

export const usersApi = {
  /**
   * Uploads the avatar image directly to POST /api/v1/users/avatar via multipart/form-data
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

          // FIXED: Swagger returns `body.code` (1000 = OK, 1001 = CREATED), NOT `body.status`
          if (
            xhr.status >= 200 &&
            xhr.status < 300 &&
            (body.code === ApiStatus.OK || body.code === ApiStatus.CREATED)
          ) {
            resolve(body.data);
          } else {
            // Extract detailed validation or error message from Swagger error format
            const fieldErrorMsg =
              body.code === ApiStatus.VALIDATION_FAILED &&
              body.data &&
              typeof body.data === "object" &&
              "avatar" in body.data &&
              Array.isArray((body.data as Record<string, string[]>).avatar)
                ? (body.data as Record<string, string[]>).avatar[0]
                : undefined;

            const nestedMsg =
              body.data &&
              typeof body.data === "object" &&
              "message" in body.data &&
              typeof (body.data as { message?: string }).message === "string"
                ? (body.data as { message: string }).message
                : undefined;

            reject(
              new Error(
                fieldErrorMsg || nestedMsg || body.message || `Upload failed (${xhr.status})`
              )
            );
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