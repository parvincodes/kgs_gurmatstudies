export const SITE_GATE_COOKIE = "kgs_site_gate";

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeGateToken(passcode: string): Promise<string> {
  return sha256Hex(`kgs-site-gate:${passcode}`);
}

export async function isValidGateToken(
  token: string | undefined,
): Promise<boolean> {
  const passcode = process.env.UPLOAD_PASSCODE;
  if (!passcode || !token) return false;
  const expected = await computeGateToken(passcode);
  return token === expected;
}
