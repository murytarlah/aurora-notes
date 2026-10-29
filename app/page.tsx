"use client";

import { useEffect, useState } from "react";
import type { Note } from "./actions";
import { NoteEditor } from "./note-editor";
import { NoteList } from "./note-list";
import { matchesSearch } from "./note-utils";
import { NoteView } from "./note-view";
import { Sidebar } from "./sidebar";
import { panelClass } from "./ui";

const STORAGE_KEY = "aurora-notes";

export default function Home() {
  // null until saved notes have been read, so the empty initial state
  // never overwrites what's in localStorage.
  const [notes, setNotes] = useState<Note[] | null>(null);
  // The note open in the right pane; null shows the new-note form.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // null shows every note
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  const allNotes = notes ?? [];
  const current = allNotes.find((n) => n.id === selectedId);
  const visibleNotes =
    notes &&
    notes.filter(
      (n) => (!activeTag || n.tags.includes(activeTag)) && matchesSearch(n, query),
    );

  const tagCounts = new Map<string, number>();
  for (const note of allNotes) {
    for (const tag of note.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }

  function handleSaved(note: Note) {
    setNotes((prev) => [note, ...(prev ?? [])]);
    setSelectedId(note.id);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:h-dvh lg:flex-row">
      <Sidebar
        noteCount={allNotes.length}
        tagCounts={[...tagCounts.entries()].sort(([a], [b]) => a.localeCompare(b))}
        activeTag={activeTag}
        onSelectTag={setActiveTag}
        onNewNote={() => setSelectedId(null)}
      />

      <NoteList
        notes={visibleNotes}
        hasNotes={allNotes.length > 0}
        heading={activeTag ? `#${activeTag}` : "All notes"}
        query={query}
        onQueryChange={setQuery}
        selectedId={current?.id ?? null}
        onSelect={setSelectedId}
      />

      <main className={`${panelClass} flex min-w-0 flex-1 flex-col lg:overflow-hidden`}>
        <header className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-3.5 sm:px-8 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Library <span className="mx-1.5 text-slate-300 dark:text-slate-600">/</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {current ? "Note" : "New note"}
            </span>
          </p>
          <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px] shadow-emerald-400" />
            Saved in this browser
          </p>
        </header>

        <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 lg:overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
            {current ? <NoteView note={current} /> : <NoteEditor onSaved={handleSaved} />}
          </div>
        </div>
      </main>
    </div>
  );
}
