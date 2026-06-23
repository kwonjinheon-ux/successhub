"use client";

export const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "Uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Number", test: (value: string) => /\d/.test(value) },
  { label: "Special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) }
];

export function getPasswordChecks(password: string) {
  return passwordRules.map((rule) => ({ ...rule, isValid: rule.test(password) }));
}

export function isStrongPassword(password: string) {
  return getPasswordChecks(password).every((rule) => rule.isValid);
}
