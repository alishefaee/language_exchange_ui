// src/features/onboarding/onboardingConstants.ts
import { ProficiencyLevel } from "../../api/users.api";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export const CEFR_LEVELS: ProficiencyLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const ISO_COUNTRIES: CountryOption[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
];

export const LANGUAGES_LIST: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", flag: "🇪🇬" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
];