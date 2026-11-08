// src/types/api.ts

export const ApiStatus = {
  OK: 1000,
  CREATED: 1001,
  UNAUTHORIZED: 2000,
  FORBIDDEN: 2001,
  AUTH_USER_NOT_FOUND: 2003,
  AUTH_TOKEN_EXPIRED: 2004,
  BAD_REQUEST: 3000,
  VALIDATION_FAILED: 3001,
  RESOURCE_NOT_FOUND: 3002,
  INTERNAL_ERROR: 5000,
} as const;

export type ApiStatus = (typeof ApiStatus)[keyof typeof ApiStatus];

export type OnboardingStep =
  | "identity"
  | "locations"
  | "languages"
  | "avatar"
  | "completed";

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

export interface IUser {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
  age?: number | null;
  gender?: GenderType | null;
  religion?: string | null;
  countryOfOrigin?: string | null;
  countryOfResidence?: string | null;
  nativeLanguages?: LanguageProficiencyEntry[];
  learningLanguages?: LanguageProficiencyEntry[];
  lastLogin?: string;
  lastUpdatedProfile?: string | null;
  onboardingStep: OnboardingStep;
  blockedUsers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: ApiStatus;
  message?: string;
  data: T;
}

export class ApiError extends Error {
  public readonly code: ApiStatus;
  public readonly httpStatus: number;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    code: ApiStatus,
    httpStatus: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.fieldErrors = fieldErrors;
  }
}