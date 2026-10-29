"use server";

export type Note = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

export type CheckNoteResult = { error: string } | { note: Note };

export async function checkNote(formData: FormData): Promise<CheckNoteResult> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const rawTags = String(formData.get("tags") ?? "");

  if (!title) return { error: "Title is required." };
  if (!body) return { error: "Body is required." };

  const tags = [
    ...new Set(
      rawTags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];

  if (tags.length === 0) return { error: "At least one tag is required." };

  return { note: { id: crypto.randomUUID(), title, body, tags } };
}
