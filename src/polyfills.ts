// Global polyfills for libraries expecting Node globals in the browser
// Fix SockJS browser-crypto expecting `global`
(window as any).global = (window as any).global || window;

// Optional: define minimal process to appease some libs if needed
// (uncomment if you hit `process is not defined`)
// (window as any).process = (window as any).process || { env: { } };

