import Markdown from "react-markdown";

// Renders a note body as Markdown. Raw HTML in the text is not rendered,
// so note content can't inject markup or scripts.
export function NoteMarkdown({ children }: { children: string }) {
  return (
    <div className="note-markdown">
      <Markdown>{children}</Markdown>
    </div>
  );
}
