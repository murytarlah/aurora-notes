import { createElement } from "react";
import Markdown, { type Components } from "react-markdown";

// Builds a Markdown element renderer with Tailwind classes. react-markdown
// also passes `node` (its syntax-tree object), which must not reach the DOM.
function styled(tag: string, className: string, extraProps?: object) {
  function Styled(props: { node?: unknown; className?: string }) {
    const { node, className: own, ...rest } = props;
    void node;
    return createElement(tag, {
      ...extraProps,
      ...rest,
      className: own ? `${className} ${own}` : className,
    });
  }
  return Styled;
}

const headingClass = "font-bold tracking-tight text-slate-900 dark:text-slate-100";

// Tailwind's base reset strips heading sizes, list bullets and spacing, so
// each Markdown element gets its styles back here.
const components: Components = {
  h1: styled("h1", `${headingClass} text-2xl`),
  h2: styled("h2", `${headingClass} text-xl`),
  h3: styled("h3", `${headingClass} text-lg`),
  h4: styled("h4", `${headingClass} text-base`),
  strong: styled("strong", "font-bold text-slate-900 dark:text-slate-100"),
  em: styled("em", "italic"),
  ul: styled("ul", "list-disc space-y-1 pl-5 marker:text-teal-500"),
  ol: styled("ol", "list-decimal space-y-1 pl-5 marker:text-teal-500"),
  a: styled(
    "a",
    "text-teal-700 underline underline-offset-2 hover:text-teal-600 dark:text-teal-300",
    { target: "_blank", rel: "noopener noreferrer" },
  ),
  blockquote: styled(
    "blockquote",
    "border-l-4 border-violet-500 pl-3 text-slate-600 dark:text-slate-400",
  ),
  code: styled("code", "rounded bg-slate-500/15 px-1.5 py-0.5 font-mono text-[0.9em]"),
  pre: styled(
    "pre",
    "overflow-x-auto rounded-lg bg-slate-500/10 p-3 [&>code]:bg-transparent [&>code]:p-0",
  ),
  hr: styled("hr", "border-slate-300 dark:border-slate-700"),
};

// Renders a note body as Markdown. Raw HTML in the text is not rendered,
// so note content can't inject markup or scripts.
export function NoteMarkdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere] dark:text-slate-300">
      <Markdown components={components}>{children}</Markdown>
    </div>
  );
}
