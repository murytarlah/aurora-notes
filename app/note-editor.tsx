"use client";

import { useState, useTransition, type FormEvent } from "react";
import { checkNote, type Note } from "./actions";
import { AlertIcon, EyeIcon, PencilIcon, TagIcon } from "./icons";
import { NoteMarkdown } from "./note-markdown";
import { gradientButtonClass, inputClass } from "./ui";

const BODY_PLACEHOLDER = `# Riverside Garden Cleanup

**Saturday 14 November · 9:00 AM** at the north gate

- Bring gloves, bin bags and water
- Collect the spare rakes from the shed
- Share the volunteer sign-up link by Thursday`;

const tabClass = "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition";
const tabActiveClass = "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100";
const tabIdleClass = "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200";

export function NoteEditor({ onSaved }: { onSaved: (note: Note) => void }) {
  const [body, setBody] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await checkNote(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onSaved(result.note);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-5">
      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-md border border-red-300 border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 dark:border-red-900 dark:border-l-red-500 dark:bg-red-950/60 dark:text-red-200"
        >
          <AlertIcon className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
          {error}
        </p>
      )}

      <label className="flex flex-col">
        <span className="sr-only">Title</span>
        <input
          name="title"
          type="text"
          autoFocus
          className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none sm:text-4xl dark:text-slate-100 dark:placeholder:text-slate-600"
          placeholder="Riverside Garden Cleanup"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="sr-only">Tags</span>
        <span className="relative">
          <TagIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="tags"
            type="text"
            className={`${inputClass} pl-10`}
            placeholder="volunteering, community, weekend"
          />
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Use commas between tags. Duplicates are removed automatically.
        </span>
      </label>

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Note body</span>
          <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              aria-pressed={!isPreview}
              className={`${tabClass} ${isPreview ? tabIdleClass : tabActiveClass}`}
            >
              <PencilIcon className="h-3.5 w-3.5" /> Write
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              aria-pressed={isPreview}
              className={`${tabClass} ${isPreview ? tabActiveClass : tabIdleClass}`}
            >
              <EyeIcon className="h-3.5 w-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Stays mounted while previewing so its value is still submitted */}
        <textarea
          name="body"
          aria-label="Note body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          hidden={isPreview}
          className={`${inputClass} min-h-72 flex-1 resize-y font-mono leading-relaxed`}
          placeholder={BODY_PLACEHOLDER}
        />
        {isPreview && (
          <div className="min-h-72 flex-1 rounded-xl border border-slate-200 bg-white/70 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/50">
            {body.trim() ? (
              <NoteMarkdown>{body}</NoteMarkdown>
            ) : (
              <p className="text-sm text-slate-400">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {body.length} {body.length === 1 ? "character" : "characters"} · Markdown supported
        </p>
        <button type="submit" disabled={isPending} className={gradientButtonClass}>
          {isPending ? "Saving…" : "Save note"}
        </button>
      </div>
    </form>
  );
}
