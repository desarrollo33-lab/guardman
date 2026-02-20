/**
 * Markdown Field Component
 * 
 * Rich markdown editor with preview for admin panel.
 */

import MDEditor from "@uiw/react-md-editor";

interface MarkdownFieldProps {
  value?: string;
  onChange?: (value?: string | undefined) => void;
  minHeight?: number;
}

export function MarkdownField({
  value,
  onChange,
  minHeight = 200,
}: MarkdownFieldProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="live"
        height={minHeight}
      />
    </div>
  );
}
