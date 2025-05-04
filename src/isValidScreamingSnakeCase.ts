/**
 * Validates if a string is in SCREAMING_SNAKE_CASE format and is a valid JavaScript property name
 *
 * @param value The string to validate
 * @returns An object with validation result and optional error message
 */
export function isValidScreamingSnakeCase(
  value: string
): { errorMessage?: never; isValid: true } | { errorMessage: string; isValid: false } {
  // Check if the value is in SCREAMING_SNAKE_CASE format
  // Only uppercase letters, numbers, and underscores allowed
  // Must start with a letter (not a number)
  const screamingSnakeCaseRegex = /^[A-Z][A-Z0-9_]*$/;

  if (!screamingSnakeCaseRegex.test(value)) {
    return {
      errorMessage:
        'Value must be in SCREAMING_SNAKE_CASE format (uppercase letters, numbers, and underscores only)',
      isValid: false,
    };
  }

  // Additional check for JavaScript identifier validity
  try {
    // Test if the value would be a valid property name
    const testObj = {};
    Object.defineProperty(testObj, value, { value: true });
    return { isValid: true };
  } catch (error) {
    return {
      errorMessage: `"${value}" is not a valid property name`,
      isValid: false,
    };
  }
}
