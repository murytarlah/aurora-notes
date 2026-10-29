import type { Note } from "./actions";
import { NoteMarkdown } from "./note-markdown";
import { tagColor } from "./note-utils";

export function NoteView({ note }: { note: Note }) {
  return (
    <article className="flex flex-1 flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
        {note.title}
      </h1>

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
