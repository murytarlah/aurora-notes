import type { Note } from "./actions";
import { NotebookPenIcon } from "./icons";
import { snippet, tagColor } from "./note-utils";
import { panelClass, sectionLabelClass } from "./ui";

type NoteListProps = {
  // null while saved notes are still being read
  notes: Note[] | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function NoteList({ notes, selectedId, onSelect }: NoteListProps) {
  return (
    <section className={`${panelClass} flex flex-col gap-4 p-4 lg:w-80 lg:shrink-0 lg:overflow-hidden lg:p-5`}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className={sectionLabelClass}>Notes</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            All notes
          </h2>
        </div>
        {notes && (
          <span className="pb-1 text-xs text-slate-500 dark:text-slate-400">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        )}
      </div>

      <div className="-mx-1 flex-1 px-1 lg:overflow-y-auto">
        {notes === null ? null : notes.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
            <NotebookPenIcon className="h-8 w-8 text-teal-500 dark:text-teal-400" />
            <p className="font-semibold text-slate-900 dark:text-slate-100">Your space is ready</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your first note will appear here once it&apos;s saved.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((note) => {
              const isSelected = note.id === selectedId;
              return (
                <li key={note.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(note.id)}
                    aria-current={isSelected}
                    className={`flex w-full flex-col gap-1.5 rounded-xl border p-3.5 text-left transition ${
                      isSelected
                        ? "border-teal-400/60 bg-linear-to-br from-emerald-500/10 via-cyan-500/5 to-violet-500/10 shadow-sm dark:border-teal-400/40"
                        : "border-transparent hover:border-slate-200 hover:bg-white/60 dark:hover:border-slate-700 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {note.title}
                    </span>
                    <span className="line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {snippet(note.body)}
                    </span>
                    <span className="flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${tagColor(tag).chip}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
