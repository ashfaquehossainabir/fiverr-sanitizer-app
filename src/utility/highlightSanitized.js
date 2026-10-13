// highlightSanitized.js
import { RESERVED_KEYWORDS } from "../sanitizer.js";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Mirrors sanitizeWord() in sanitizer.js:
 *   mail / email -> ma-il / em-ail
 *   everything else -> c_ontact, p_ayment, w_hatsapp ...
 */
function sanitizedForm(keyword) {
  if (keyword === "mail" || keyword === "email") {
    return `${keyword.slice(0, 2)}-${keyword.slice(2)}`;
  }
  return `${keyword[0]}_${keyword.slice(1)}`;
}

// Built once from the same keyword list the sanitizer uses, so the two never drift apart.
// Longest first so "s_ervices" wins over "s_ervice".
const SANITIZED_REGEX = new RegExp(
  `\\b(?:${[...new Set(RESERVED_KEYWORDS.map(sanitizedForm))]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join("|")})\\b`,
  "gi"
);

/**
 * Wraps sanitized reserved words (c_ontact, em-ail, ma-il, ...) in a highlight span.
 * Expects text that is already HTML-escaped.
 */
export function highlightSanitizedText(text) {
  if (!text) return "";
  return text.replace(
    SANITIZED_REGEX,
    (match) => `<span class="highlight">${match}</span>`
  );
}
