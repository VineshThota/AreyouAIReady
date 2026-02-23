export async function getUserGeography(): Promise<{ city?: string; country?: string }> {
  try {
    // Use ipapi.co — free, no API key needed, HTTPS, generous rate limits
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) return {};

    const data = await response.json();

    // ipapi.co returns an error field when rate-limited or unavailable
    if (data.error) return {};

    return {
      city: data.city || undefined,
      country: data.country_name || undefined,
    };
  } catch {
    // Silently fail — geolocation is non-critical, never block quiz completion
    return {};
  }
}
