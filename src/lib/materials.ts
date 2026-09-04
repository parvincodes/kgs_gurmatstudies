export type Subject = "Gurbani" | "History" | "Philosophy";
export type MaterialType = "Reading" | "Audio" | "Video" | "Worksheet" | "Discussion";

export type Material = {
  id: string;
  title: string;
  subject: Subject;
  type: MaterialType;
  description: string;
  tags: string[];
};

export const SUBJECTS: Subject[] = ["Gurbani", "History", "Philosophy"];

export const MATERIALS: Material[] = [
  {
    id: "japji-sahib-intro",
    title: "Japji Sahib: An Introduction",
    subject: "Gurbani",
    type: "Reading",
    description:
      "An overview of Japji Sahib's structure and why it opens Sri Guru Granth Sahib Ji.",
    tags: ["Japji Sahib", "Nitnem"],
  },
  {
    id: "mool-mantar-meaning",
    title: "Understanding the Mool Mantar",
    subject: "Gurbani",
    type: "Discussion",
    description:
      "A line-by-line look at the Mool Mantar and the core ideas about Waheguru it introduces.",
    tags: ["Japji Sahib", "Foundations"],
  },
  {
    id: "nitnem-why-it-matters",
    title: "Why Nitnem Matters",
    subject: "Gurbani",
    type: "Reading",
    description:
      "What daily Nitnem is, which Banis are included, and how it shapes a daily discipline.",
    tags: ["Nitnem", "Daily Practice"],
  },
  {
    id: "japji-sahib-recitation",
    title: "Japji Sahib — Full Recitation",
    subject: "Gurbani",
    type: "Audio",
    description: "A guided audio recitation of Japji Sahib for daily listening and practice.",
    tags: ["Japji Sahib", "Audio"],
  },
  {
    id: "partition-1947-overview",
    title: "1947: What Happened and Why",
    subject: "History",
    type: "Reading",
    description:
      "A student-friendly overview of Partition — the events, the decisions behind them, and their impact on Punjab.",
    tags: ["1947", "Partition"],
  },
  {
    id: "1984-timeline",
    title: "1984: A Timeline",
    subject: "History",
    type: "Reading",
    description:
      "The key events of 1984, laid out chronologically, to understand what happened and when.",
    tags: ["1984"],
  },
  {
    id: "1984-discussion-guide",
    title: "1984: Discussion Guide",
    subject: "History",
    type: "Discussion",
    description:
      "Guided questions for exploring the underlying issues behind 1984 and what they mean today.",
    tags: ["1984", "Discussion"],
  },
  {
    id: "sikh-history-documentary",
    title: "Sikh History of the 20th Century",
    subject: "History",
    type: "Video",
    description: "A short documentary covering the major events shaping Sikh history since 1947.",
    tags: ["1947", "1984", "Video"],
  },
  {
    id: "sikh-philosophy-intro",
    title: "Core Ideas in Sikh Philosophy",
    subject: "Philosophy",
    type: "Reading",
    description:
      "An introduction to key Sikh philosophical concepts, grounded in selected Shabads.",
    tags: ["Philosophy", "Shabad"],
  },
  {
    id: "comparative-religion-worksheet",
    title: "Comparing Faith Traditions",
    subject: "Philosophy",
    type: "Worksheet",
    description:
      "A worksheet comparing core Sikh concepts with ideas from other major religious traditions.",
    tags: ["Comparative Religion"],
  },
  {
    id: "shabad-study-seva",
    title: "Shabad Study: Understanding Seva",
    subject: "Philosophy",
    type: "Discussion",
    description: "Exploring what Gurbani says about selfless service, through selected Shabads.",
    tags: ["Seva", "Shabad"],
  },
  {
    id: "ethics-in-daily-life",
    title: "Gurmat Ethics in Daily Life",
    subject: "Philosophy",
    type: "Reading",
    description: "How Sikh philosophy translates into everyday decisions and character.",
    tags: ["Philosophy", "Daily Life"],
  },
];
