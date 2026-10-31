/** Only same-site paths are allowed, so a crafted login link can't send users elsewhere. */
export function getSafeRedirectPath(path: string | null | undefined) {
  // Browsers strip whitespace from URLs and treat "\" as "/", so both are
  // rejected to stop a value turning into "//other-site.com".
  if (!path || !/^\/(?!\/)[^\s\\]*$/.test(path)) return "/";
  return path;
}
