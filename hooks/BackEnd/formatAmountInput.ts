export function normalizeAmountInput(value: string | number): string {
  return String(value)
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[^0-9]/g, "");
}

export function formatAmountInput(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) return "";

  const digits = normalizeAmountInput(value);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseAmountInput(value: string | number): number | null {
  const digits = normalizeAmountInput(value);
  return digits ? Number(digits) : null;
}
