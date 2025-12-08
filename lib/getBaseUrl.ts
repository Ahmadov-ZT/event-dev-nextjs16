export function getBaseUrl() {
  // 1. Prefer public env variable
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 2. Vercel dynamically provides your URL during deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Local development fallback
  return "http://localhost:3000";
}
