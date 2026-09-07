export const OTHER = "Other";

export const HOPES = [
  "A stronger personal connection to Gurbani & daily Nitnem",
  "More confidence in their Sikh identity around peers",
  "A real understanding of Sikh history and why it matters today",
  "Sikh values (seva, humility, equality) showing up in daily life",
  "Comfort reading and understanding Gurmukhi",
  "Meaningful friendships within the Sangat",
];
export const MAX_HOPES = 2;

export const DISCUSSION_TOPICS = [
  "Why we do certain things (rehat, articles of faith, practices)",
  "How Sikhi compares to other religions or friends' beliefs",
  "Navigating being visibly different at school",
  "Sikh history or current events (Punjab, diaspora, activism)",
  "Doubts or questions about faith itself",
  "They don't really bring it up unless I ask",
];

export const IDENTITY_STRUGGLES = [
  "Feeling different from friends at school",
  "Peer pressure around choices that conflict with Sikh values (hair, dating, etc.)",
  "Questioning or doubting aspects of the faith",
  "Sikhi feeling like a family obligation more than a personal choice",
  "Difficulty with Punjabi / Gurmukhi",
  "Balancing time for Sikhi practices with school and other commitments",
  "Not that I've noticed",
];

export const PRACTICE_HABITS = [
  "Daily Nitnem / Japji Sahib",
  "Attends Gurdwara / Sangat regularly",
  "Does seva (langar, cleaning, etc.)",
  "Listens to kirtan / shabad",
  "Wears or maintains articles of faith",
  "Not much right now",
];

export const PRIORITY_TOPICS = [
  "Gurbani & Nitnem",
  "Sikh history (1947, 1984, etc.)",
  "Sikh philosophy & comparing faiths",
  "Community & seva",
  "Preparing for a milestone like Amrit Sanchar",
  "Applying values to daily life",
];

export const MAX_PRIORITY_TOPICS = 2;

// A selected list is valid if it has at least one choice, and if "Other"
// is one of them, the accompanying free-text explanation isn't empty.
export function isValidSelection(selected: string[], otherText: string | null | undefined): boolean {
  if (selected.length === 0) return false;
  if (selected.includes(OTHER) && !otherText?.trim()) return false;
  return true;
}
