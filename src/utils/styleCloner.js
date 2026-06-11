export const cloneStyles = (targetDocument) => {
  if (!targetDocument || !targetDocument.head) return;

  // 1. Clone link tags (e.g., Google Fonts, external CSS)
  document.head.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"], link[rel="preload"]').forEach(link => {
    targetDocument.head.appendChild(link.cloneNode(true));
  });

  // 2. Extract ALL active CSS rules and inject them into a new <style> tag
  // This guarantees we capture Tailwind v4 Vite styles, inline CSS, and CSSOM changes
  const combinedStyles = targetDocument.createElement('style');
  let combinedCSS = '';

  Array.from(document.styleSheets).forEach((styleSheet) => {
    try {
      if (styleSheet.cssRules) {
        Array.from(styleSheet.cssRules).forEach((rule) => {
          combinedCSS += rule.cssText + '\n';
        });
      }
    } catch (e) {
      console.warn('Could not access cssRules for stylesheet (likely CORS). Relying on link clone:', styleSheet.href);
    }
  });

  combinedStyles.appendChild(targetDocument.createTextNode(combinedCSS));
  targetDocument.head.appendChild(combinedStyles);

  // Apply document root classes for Tailwind dark mode / arbitrary theme selectors
  targetDocument.documentElement.className = document.documentElement.className;
  targetDocument.body.className = document.body.className;
};
