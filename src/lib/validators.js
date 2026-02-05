/**
 * Validation utility functions
 * ALL validation logic should live here - never duplicate
 */

/**
 * Validate email format
 * @param {string} email
 */
export function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone number (basic)
 * @param {string} phone
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  return /^\+?[\d\s-()]{10,}$/.test(phone);
}

/**
 * Validate URL format
 * @param {string} url
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check minimum length
 * @param {string} str
 * @param {number} min
 */
export function hasMinLength(str, min) {
  return str && str.length >= min;
}

/**
 * Check maximum length
 * @param {string} str
 * @param {number} max
 */
export function hasMaxLength(str, max) {
  return !str || str.length <= max;
}

/**
 * Validate required field
 * @param {any} value
 */
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/**
 * Create a form validator
 * @param {Object} rules - { fieldName: [validatorFn, errorMessage] }
 * @returns {function} - returns { valid: boolean, errors: { field: message } }
 */
export function createValidator(rules) {
  return (data) => {
    const errors = {};

    for (const [field, validations] of Object.entries(rules)) {
      for (const [validator, message] of validations) {
        if (!validator(data[field])) {
          errors[field] = message;
          break;
        }
      }
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };
}
