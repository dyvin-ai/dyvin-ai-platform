/**
 * Standardized numerical and date formatting utilities for Dyvin AI Analytics.
 */

export function formatVisibility(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatPtsChange(val: number): string {
  if (val === 0) return "0.0 pts";
  return val > 0 ? `+${val.toFixed(1)} pts` : `${val.toFixed(1)} pts`;
}

export function formatPosition(val: number): string {
  return `#${val.toFixed(1)}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString("en-US");
}

export function formatSoV(val: number): string {
  return `${val.toFixed(1)}%`;
}
