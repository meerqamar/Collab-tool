import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes rich text HTML strings to mitigate Cross-Site Scripting (XSS) vulnerabilities.
 * Works both on Server Components/API routes and Client Components.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'ul', 'li', 'ol', 'a', 'strong', 'em',
      'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'class', 'rel', 'style'],
  });
}
