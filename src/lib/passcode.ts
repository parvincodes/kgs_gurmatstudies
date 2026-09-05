import { timingSafeEqual } from "crypto";

export function isValidPasscode(candidate: string | null | undefined): boolean {
  const expected = process.env.UPLOAD_PASSCODE;
  if (!expected || !candidate) return false;

  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
