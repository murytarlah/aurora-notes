import { LayersIcon, NotebookPenIcon, PlusIcon, SparklesIcon } from "./icons";
import { tagColor } from "./note-utils";
import { gradientButtonClass, panelClass, sectionLabelClass } from "./ui";

type SidebarProps = {
  noteCount: number;
  tagCounts: [tag: string, count: number][];
  activeTag: string | null;
  onSelectTag: (tag: string | null) => void;
  onNewNote: () => void;
  className?: string;
};

// On phones these are chips in one swipeable row; from lg up, a vertical list.
const navItemClass =
  "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-sm transition lg:w-full lg:gap-2.5 lg:rounded-xl lg:py-2";
const navActiveClass =
  "bg-teal-500/10 font-semibold text-teal-900 ring-1 ring-teal-500/30 dark:bg-teal-400/10 dark:text-teal-100 dark:ring-teal-400/30";
const navIdleClass =
  "text-slate-600 ring-1 ring-slate-300/70 hover:bg-slate-500/10 lg:ring-0 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-400/10";

export function Sidebar({
  noteCount,
  tagCounts,
  activeTag,
  onSelectTag,
  onNewNote,
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={`${panelClass} ${className} flex-col gap-4 p-4 lg:w-64 lg:shrink-0 lg:gap-5 lg:p-5`}
    >
      <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 via-teal-500 to-violet-600 text-white shadow-md shadow-teal-900/20">
            <NotebookPenIcon className="h-5 w-5" />
          </div>
          <span className="bg-linear-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-xl font-bold tracking-tight text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-violet-400">
            Aurora Notes
          </span>
        </div>
        <button type="button" onClick={onNewNote} className={gradientButtonClass}>
          <PlusIcon className="h-4 w-4" />
          New note
        </button>
      </div>

      {/* The fade on the right edge hints that the chip row scrolls on phones */}
      <nav
        aria-label="Filter notes"
        className="-mx-4 flex gap-1.5 overflow-x-auto px-4 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:[mask-image:none]"
      >
        <p className={`${sectionLabelClass} mb-1 hidden lg:block`}>Library</p>
        <button
          type="button"
          onClick={() => onSelectTag(null)}
          aria-pressed={activeTag === null}
          className={`${navItemClass} ${activeTag === null ? navActiveClass : navIdleClass}`}
        >
          <LayersIcon className="h-4 w-4" />
          <span className="flex-1 text-left">
            All<span className="hidden lg:inline"> notes</span>
          </span>
          <span className="text-xs tabular-nums opacity-70">{noteCount}</span>
        </button>

        <p className={`${sectionLabelClass} mt-4 mb-1 hidden lg:block`}>Tags</p>
        {tagCounts.length === 0 ? (
          <p className="hidden px-3 text-xs text-slate-500 lg:block dark:text-slate-400">
            Tags you add will show up here.
          </p>
        ) : (
          tagCounts.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              // Clicking the active tag again clears the filter
              onClick={() => onSelectTag(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={`${navItemClass} ${activeTag === tag ? navActiveClass : navIdleClass}`}
            >
              <span className={`h-2 w-2 rounded-full ${tagColor(tag).dot}`} />
              <span className="flex-1 text-left">{tag}</span>
              <span className="text-xs tabular-nums opacity-70">{count}</span>
            </button>
          ))
        )}
        {/* Keeps the last chip clear of the fade */}
        <span aria-hidden className="w-6 shrink-0 lg:hidden" />
      </nav>

      <div className="mt-auto hidden flex-col gap-3 rounded-xl bg-linear-to-br from-emerald-500/10 via-cyan-500/10 to-violet-500/10 p-4 lg:flex">
        <SparklesIcon className="h-5 w-5 text-violet-500 dark:text-violet-400" />
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Your thoughts, organised.
        </p>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          Write in Markdown and organise your notes with tags.
        </p>
      </div>
    </aside>
  );
}
