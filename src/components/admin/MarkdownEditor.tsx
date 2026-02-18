import { useState, useRef, useCallback } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  error?: string;
}

/**
 * Simple markdown to HTML converter
 * Handles: bold, italic, links, lists, headings, paragraphs
 */
function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return '';

  let html = markdown;

  // Escape HTML entities first
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headings (h1-h6)
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Unordered lists (- item or * item)
  html = html.replace(
    /^[\-\*]\s+(.+)$/gm,
    '<li class="ml-4 list-disc">$1</li>'
  );

  // Wrap consecutive list items in <ul>
  html = html.replace(
    /(<li[^>]*>.*?<\/li>\n?)+/g,
    (match) => `<ul class="my-2">${match}</ul>`
  );

  // Line breaks - convert double newlines to paragraph breaks
  html = html
    .split(/\n\n+/)
    .map((block) => {
      // Don't wrap if already wrapped in a block element
      if (block.match(/^<(h[1-6]|ul|ol|li|blockquote|pre)/)) {
        return block;
      }
      // Wrap in paragraph if it has content
      if (block.trim()) {
        return `<p class="mb-2">${block.replace(/\n/g, '<br />')}</p>`;
      }
      return '';
    })
    .join('');

  return html;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Escribe aquí usando markdown...',
  rows = 10,
  label,
  error,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showPreview, setShowPreview] = useState(true);

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = prefix, placeholderText: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const textToInsert = selectedText || placeholderText;

      const newText =
        value.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        value.substring(end);

      onChange(newText);

      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + prefix.length + textToInsert.length;
        if (selectedText) {
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        } else {
          // If no text was selected, select the placeholder
          textarea.setSelectionRange(start + prefix.length, newCursorPos);
        }
      }, 0);
    },
    [value, onChange]
  );

  const insertAtLineStart = useCallback(
    (prefix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Find the start of the current line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;

      const newText =
        value.substring(0, lineStart) + prefix + value.substring(lineStart);

      onChange(newText);

      // Adjust cursor position
      setTimeout(() => {
        textarea.focus();
        const adjustment = prefix.length;
        textarea.setSelectionRange(start + adjustment, end + adjustment);
      }, 0);
    },
    [value, onChange]
  );

  const toolbarButtons = [
    {
      label: 'Negrita',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"
          />
        </svg>
      ),
      action: () => insertMarkdown('**', '**', 'texto en negrita'),
      title: 'Negrita (**texto**)',
    },
    {
      label: 'Cursiva',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 4h4m-2 0v16m4-16l-4 16"
          />
        </svg>
      ),
      action: () => insertMarkdown('*', '*', 'texto en cursiva'),
      title: 'Cursiva (*texto*)',
    },
    {
      label: 'Enlace',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      ),
      action: () => insertMarkdown('[', '](url)', 'texto del enlace'),
      title: 'Enlace ([texto](url))',
    },
    {
      label: 'Lista',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="2" cy="12" r="1" fill="currentColor" />
          <circle cx="2" cy="18" r="1" fill="currentColor" />
        </svg>
      ),
      action: () => insertAtLineStart('- '),
      title: 'Lista (- item)',
    },
    {
      label: 'Título',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h10M4 18h6"
          />
        </svg>
      ),
      action: () => insertAtLineStart('## '),
      title: 'Título (## texto)',
    },
  ];

  const previewHtml = markdownToHtml(value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-100 border border-b-0 border-gray-300 rounded-t-lg">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            showPreview
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          title={showPreview ? 'Ocultar vista previa' : 'Mostrar vista previa'}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="hidden sm:inline">Vista previa</span>
        </button>
      </div>

      {/* Editor and Preview */}
      <div
        className={`border border-gray-300 rounded-b-lg overflow-hidden ${
          showPreview ? 'flex flex-col md:flex-row' : ''
        }`}
      >
        {/* Textarea */}
        <div className={showPreview ? 'flex-1' : ''}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`w-full px-3 py-2 font-mono text-sm resize-none focus:outline-none ${
              showPreview
                ? 'border-0 border-b md:border-b-0 md:border-r border-gray-300'
                : 'border-0 rounded-b-lg'
            } ${error ? 'bg-red-50' : 'bg-white'}`}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div
            className="flex-1 px-3 py-2 bg-gray-50 overflow-y-auto prose prose-sm max-w-none"
            style={{
              minHeight: `${rows * 1.5 + 1}rem`,
              maxHeight: `${rows * 1.5 + 1}rem`,
            }}
          >
            {previewHtml ? (
              <div
                className="text-gray-800 text-sm"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p className="text-gray-400 italic text-sm">
                La vista previa aparecerá aquí...
              </p>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Help text */}
      <p className="mt-1 text-xs text-gray-500">
        Formato: **negrita** *cursiva* [enlace](url) - lista ## título
      </p>
    </div>
  );
}

export default MarkdownEditor;
