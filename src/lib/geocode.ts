// Free geocoding via OpenStreetMap's Nominatim. Called once per signup
// (not per page view), which comfortably fits within their usage policy:
// https://operations.osmfoundation.org/policies/nominatim/

export async function geocodeCityState(city: string, state: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const params = new URLSearchParams({
      city,
      state,
      country: "US",
      format: "json",
      limit: "1",
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { "Accept-Language": "en" },
    });
    if (!res.ok) return null;

    const results = (await res.json()) as { lat: string; lon: string }[];
    const first = results[0];
    if (!first) return null;

    return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
  } catch {
    return null;
  }
}
