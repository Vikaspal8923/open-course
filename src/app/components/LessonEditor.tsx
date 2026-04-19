import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  Table2 as TableIcon,
} from 'lucide-react';

interface LessonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const toolbarButtonClass =
  'inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors';

export function LessonEditor({
  value,
  onChange,
  placeholder = 'Write your lesson content here...',
}: LessonEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        autolink: true,
        openOnClick: true,
        defaultProtocol: 'https',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'lesson-editor max-h-[320px] min-h-[220px] overflow-y-auto rounded-b-xl border border-t-0 border-gray-200 bg-white px-4 py-3 focus:outline-none',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();
    const nextHtml = value || '<p></p>';

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter a URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url.trim() === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const getButtonClass = (active: boolean) =>
    `${toolbarButtonClass} ${
      active
        ? 'border-blue-200 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="flex flex-wrap gap-2 rounded-t-xl border border-gray-200 bg-gray-50 p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive('bulletList'))}
        >
          <List className="h-4 w-4" />
          Bullet List
        </button>
        <button
          type="button"
          onClick={setLink}
          className={getButtonClass(editor.isActive('link'))}
        >
          <LinkIcon className="h-4 w-4" />
          Link
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
          className={getButtonClass(editor.isActive('table'))}
        >
          <TableIcon className="h-4 w-4" />
          Table
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
