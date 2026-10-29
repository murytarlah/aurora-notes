"use client";

import { useState } from "react";
import type { Note } from "./actions";
import { TrashIcon } from "./icons";
import { NoteMarkdown } from "./note-markdown";
import { tagColor } from "./note-utils";

const secondaryButtonClass =
  "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800";

type NoteViewProps = {
  note: Note;
  onDelete: () => void;
};

export function NoteView({ note, onDelete }: NoteViewProps) {
  // Deleting takes two clicks so a stray one can't lose a note.
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <article className="flex flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 text-3xl font-bold tracking-tight text-slate-900 [overflow-wrap:anywhere] sm:text-4xl dark:text-slate-100">
          {note.title}
        </h1>

        {isConfirming ? (
          <div
            role="group"
            aria-label="Confirm delete"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-1.5 pl-3 dark:border-red-900 dark:bg-red-950/50"
          >
            <span className="text-xs font-medium text-red-800 dark:text-red-200">
              Delete this note?
            </span>
            <button
              type="button"
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              <TrashIcon className="h-3.5 w-3.5" /> Delete
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              autoFocus
              className={secondaryButtonClass}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirming(true)}
            className={`${secondaryButtonClass} hover:border-red-300 hover:text-red-700 dark:hover:border-red-800 dark:hover:text-red-300`}
          >
            <TrashIcon className="h-3.5 w-3.5" /> Delete
          </button>
        )}
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {note.tags.map((tag) => (
          <li key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tagColor(tag).chip}`}>
            {tag}
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
        <NoteMarkdown>{note.body}</NoteMarkdown>
      </div>
    </article>
  );
}
