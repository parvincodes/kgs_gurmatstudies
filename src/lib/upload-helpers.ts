export function sanitizeFilename(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot).toLowerCase() : "";
  const safeBase = base
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${safeBase || "file"}${ext}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

const KIND_BY_EXTENSION: Record<string, string> = {
  pdf: "PDF",
  doc: "Word Doc",
  docx: "Word Doc",
  ppt: "PowerPoint",
  pptx: "PowerPoint",
  mp3: "Audio",
  wav: "Audio",
  m4a: "Audio",
  aac: "Audio",
  ogg: "Audio",
  mp4: "Video",
  mov: "Video",
  webm: "Video",
};

export function inferKind(pathnameOrFilename: string): string {
  const ext = pathnameOrFilename.split(".").pop()?.toLowerCase() ?? "";
  return KIND_BY_EXTENSION[ext] ?? "File";
}

export function filenameFromPathname(pathname: string): string {
  const parts = pathname.split("/");
  return parts[parts.length - 1];
}

export function subjectFromPathname(pathname: string): string {
  const parts = pathname.split("/");
  return parts.length > 2 ? parts[1] : "Uncategorized";
}
