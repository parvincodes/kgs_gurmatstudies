// Keeps this narrow to "about Japji Sahib" as requested, not all of Gurbani/Gurmat
// studies — a bare "hukam" or "ego" question shouldn't hijack the materials search,
// even though those themes come up inside Japji too.
const JAPJI_PATTERN =
  /\b(japji|jap\s*-?\s*ji(?:\s+sahib)?|mool\s?mantar|mul\s?mantar|ik\s?-?\s?onkar|pauri(?:\s+\d{1,2})?)\b/i;

export function isJapjiQuery(text: string): boolean {
  return JAPJI_PATTERN.test(text);
}
