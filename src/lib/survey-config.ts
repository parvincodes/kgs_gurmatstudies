// Each survey campaign ("wave") gets a stable key (used for DB scoping
// and duplicate-check matching) and a display label. When it's time for
// the next wave (e.g. mid-year, end-of-year), update these three
// constants — everything else (the form, results page, duplicate
// protection) automatically scopes itself to the new wave.
export const SURVEY_WAVE = "2026-start-of-year";
export const SURVEY_LABEL = "Start of Year Survey";

export const SURVEY_OPENS_AT = new Date("2026-09-13T00:00:00-07:00");
export const SURVEY_WINDOW_DAYS = 10;
export const SURVEY_CLOSES_AT = new Date(
  SURVEY_OPENS_AT.getTime() + SURVEY_WINDOW_DAYS * 24 * 60 * 60 * 1000,
);

export type SurveyWindowStatus = "before" | "open" | "closed";

export function getSurveyWindowStatus(now: Date = new Date()): SurveyWindowStatus {
  if (now < SURVEY_OPENS_AT) return "before";
  if (now >= SURVEY_CLOSES_AT) return "closed";
  return "open";
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Los_Angeles",
};

export function formatSurveyWindow(): string {
  const lastOpenDay = new Date(SURVEY_CLOSES_AT.getTime() - 24 * 60 * 60 * 1000);
  const start = SURVEY_OPENS_AT.toLocaleDateString("en-US", DATE_FORMAT);
  const end = lastOpenDay.toLocaleDateString("en-US", DATE_FORMAT);
  return `${start} – ${end}`;
}
