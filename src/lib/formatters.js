/**
 * Formatting utility functions
 * ALL text/number formatting should live here - never duplicate
 */

/**
 * Format currency amount
 * @param {number} amount
 * @param {string} currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a full name
 * @param {string} firstName
 * @param {string} lastName
 */
export function formatName(firstName, lastName) {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
}

/**
 * Truncate text with ellipsis
 * @param {string} str
 * @param {number} length
 */
export function truncate(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length).trim() + '...';
}

/**
 * Format a number with commas
 * @param {number} num
 */
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

/**
 * Format bytes to human readable
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Capitalize first letter
 * @param {string} str
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to slug format
 * @param {string} str
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
