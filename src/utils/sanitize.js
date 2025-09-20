import DOMPurify from "dompurify";

// Basit yardımcı: HTML string'i güvenle temizle
export function sanitize(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['href','target','rel','class','id','style','src','alt','title','aria-*','role'],
    ALLOWED_TAGS: false // DOMPurify default whitelist
  });
}
