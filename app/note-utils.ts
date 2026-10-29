// Plain-text preview of a Markdown body for the note list.
export function snippet(body: string, length = 110): string {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}

// Full class strings so Tailwind can see them at build time.
const TAG_COLORS = [
  {
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    chip: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-200",
    dot: "bg-cyan-500",
  },
  {
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-200",
    dot: "bg-violet-500",
  },
  {
    chip: "bg-pink-100 text-pink-800 dark:bg-pink-950/70 dark:text-pink-200",
    dot: "bg-pink-500",
  },
  {
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  {
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-200",
    dot: "bg-sky-500",
  },
];

// The same tag always gets the same colour.
export function tagColor(tag: string) {
  let hash = 0;
  for (const char of tag) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}
