/**
 * Formats an ISO date string for display, e.g. `12 Mar 2026`.
 *
 * Centralised so every screen renders dates in the same locale and format.
 */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/**
 * Shortens a post body down to a single-line preview for list views, adding
 * an ellipsis only when content was actually cut.
 */
const truncate = (text: string, maxLength = 100) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}...` : text;

export { formatDate, truncate };
