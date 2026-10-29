"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { checkNote, type Note } from "./actions";

const STORAGE_KEY = "aurora-notes";

const inputClass =
  "w-full rounded-md border border-slate-300 bg-white/80 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400/40 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/30";

export default function Home() {
  // null until saved notes have been read, so the empty initial state
  // never overwrites what's in localStorage.
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let saved: Note[] = [];
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) saved = parsed as Note[];
    } catch {
      // Storage blocked or data corrupt: start with no notes.
    }
    // Reading localStorage after the first render keeps server and client
    // HTML identical; this one-time sync is the intended use.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes(saved);
  }, []);

  useEffect(() => {
    if (notes === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Storage full or blocked: notes still work for this session.
    }
  }, [notes]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await checkNote(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setError(null);
      setNotes((prev) => [result.note, ...(prev ?? [])]);
      form.reset();
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-12 sm:px-6">
      <h1 className="bg-linear-to-r from-emerald-500 via-cyan-500 to-violet-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-400">
        Aurora Notes
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white/70 p-5 shadow-lg shadow-cyan-900/5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-black/30"
      >
        {error && (
          <p
            role="alert"
            className="flex items-center gap-2 rounded-md border border-red-300 border-l-4 border-l-red-600 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 dark:border-red-900 dark:border-l-red-500 dark:bg-red-950/60 dark:text-red-200"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Title
          <input name="title" type="text" className={inputClass} placeholder="Note title" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Body
          <textarea name="body" rows={5} className={inputClass} placeholder="Write your note…" />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          Tags
          <input
            name="tags"
            type="text"
            className={inputClass}
            placeholder="work, ideas, todo"
          />
          <span className="text-xs font-normal text-slate-500">Separate tags with commas.</span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-md bg-linear-to-r from-emerald-600 via-teal-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-teal-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Add note"}
        </button>
      </form>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
          Notes {notes && notes.length > 0 && <span className="text-slate-500">({notes.length})</span>}
        </h2>

        {notes === null ? null : notes.length === 0 ? (
          <p className="text-sm text-slate-500">No notes yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-lg border border-slate-200 border-l-4 border-l-teal-500 bg-white/70 p-4 backdrop-blur-md dark:border-slate-800 dark:border-l-teal-400 dark:bg-slate-900/50"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {note.title}
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {note.body}
                </p>
                {note.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/50 dark:text-teal-200"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
