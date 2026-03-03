import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge.
 * @throws {TypeError} If any input is not a valid class value.
 */
export function cn(...inputs: ClassValue[]) {
  for (const input of inputs) {
    // Defensive check: clsx accepts strings, arrays, objects, etc.
    // If you want stricter validation, check for undefined or null
    if (input === undefined || input === null) {
      throw new TypeError("Class value inputs must not be undefined or null.");
    }
  }
  return twMerge(clsx(inputs));
}