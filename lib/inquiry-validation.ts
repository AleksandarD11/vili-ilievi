import type { InquiryStatus } from "@/lib/site-data";

export const EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
export const BULGARIAN_PHONE_PATTERN = "^(?:\\+359|0)8\\d{8}$";

export type InquirySubmissionPayload = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  houseId: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  message?: string;
};

export type InquiryStatusUpdatePayload = {
  inquiryId: string;
  status: InquiryStatus;
  email: string;
  firstName: string;
  lastName: string;
  houseName: string;
  checkIn: string;
  checkOut: string;
};

type InquiryValidationResult =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: InquirySubmissionPayload;
    };

const emailRegex = new RegExp(EMAIL_PATTERN);
const phoneRegex = new RegExp(BULGARIAN_PHONE_PATTERN);
const fakeMarkers = [
  "test",
  "asdf",
  "qwerty",
  "fake",
  "demo",
  "n/a",
  "none",
] as const;

function normalizeText(value: string) {
  return value.trim();
}

function looksFake(value: string) {
  const normalized = normalizeText(value).toLowerCase();

  if (!normalized) {
    return false;
  }

  if (fakeMarkers.some((marker) => normalized.includes(marker))) {
    return true;
  }

  if (/^(.)\1{4,}$/.test(normalized)) {
    return true;
  }

  if (/^(012345|123456|111111|000000)/.test(normalized.replace(/\D/g, ""))) {
    return true;
  }

  return false;
}

export function validateInquiryPayload(
  payload: InquirySubmissionPayload,
): InquiryValidationResult {
  const firstName = normalizeText(payload.firstName);
  const lastName = normalizeText(payload.lastName);
  const email = normalizeText(payload.email);
  const phone = normalizeText(payload.phone);
  const houseId = normalizeText(payload.houseId);
  const checkIn = normalizeText(payload.checkIn);
  const checkOut = normalizeText(payload.checkOut);
  const message = normalizeText(payload.message ?? "");
  const guests = Number(payload.guests);

  if (!firstName || !lastName || !email || !phone || !houseId || !checkIn || !checkOut) {
    return { success: false, error: "All required fields must be completed." };
  }

  if (firstName.length < 2 || lastName.length < 2 || looksFake(firstName) || looksFake(lastName)) {
    return { success: false, error: "Please enter a valid full name." };
  }

  if (!emailRegex.test(email) || looksFake(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  if (!phoneRegex.test(phone) || looksFake(phone)) {
    return { success: false, error: "Please enter a valid Bulgarian phone number." };
  }

  if (!Number.isInteger(guests) || guests < 1 || guests > 15) {
    return { success: false, error: "Guests must be between 1 and 15." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) {
    return { success: false, error: "Please select valid check-in and check-out dates." };
  }

  if (checkOut < checkIn) {
    return { success: false, error: "Check-out must be after check-in." };
  }

  if (message && looksFake(message)) {
    return { success: false, error: "Please remove placeholder or fake text from the notes field." };
  }

  return {
    success: true,
    data: {
      firstName,
      lastName,
      email,
      phone,
      houseId,
      checkIn,
      checkOut,
      guests,
      message,
    },
  };
}
