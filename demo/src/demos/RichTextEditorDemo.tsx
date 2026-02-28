import { lazy, Suspense } from 'react';
import { RichTextEditor, Heading, Spinner } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';
import { Bold, Italic } from 'lucide-react';

// Lazy-loaded editor engines
const TipTapEditor = lazy(() => import('./editors/TipTapEditor').then(m => ({ default: m.TipTapEditor })));
const LexicalEditor = lazy(() => import('./editors/LexicalEditor').then(m => ({ default: m.LexicalEditor })));
const PlateEditor = lazy(() => import('./editors/PlateEditor').then(m => ({ default: m.PlateEditor })));

function EditorLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--move-spacing-xl)', minHeight: 180 }}>
        <Spinner size="md" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────
// Variants
// ─────────────────────────────────────────────────────────────────

function VariantsExample() {
  return (
    <Stack direction="column" gap="xl">
      <div>
        <Heading level={4} style={{ marginBottom: 'var(--move-spacing-sm)' }}>Outline</Heading>
        <RichTextEditor.Root variant="outline">
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control aria-label="Bold" title="Bold"><Bold size={14} /></RichTextEditor.Control>
              <RichTextEditor.Control aria-label="Italic" title="Italic"><Italic size={14} /></RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content>
            <div contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
              Bordered chrome with a subtle toolbar background.
            </div>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      </div>

      <div>
        <Heading level={4} style={{ marginBottom: 'var(--move-spacing-sm)' }}>Subtle</Heading>
        <RichTextEditor.Root variant="subtle">
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <RichTextEditor.Control aria-label="Bold" title="Bold"><Bold size={14} /></RichTextEditor.Control>
              <RichTextEditor.Control aria-label="Italic" title="Italic"><Italic size={14} /></RichTextEditor.Control>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content>
            <div contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
              Minimal chrome without borders.
            </div>
          </RichTextEditor.Content>
        </RichTextEditor.Root>
      </div>
    </Stack>
  );
}


// ─────────────────────────────────────────────────────────────────
// Examples
// ─────────────────────────────────────────────────────────────────

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage (TipTap)',
    description: 'Integration with @tiptap/react. Bring your own editor, wire controls to TipTap commands.',
    component: <EditorLoader><TipTapEditor /></EditorLoader>,
    code: [
      {
        label: 'TipTap',
        code: `import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { RichTextEditor } from 'move';
import { Bold, Italic, Underline as UnderlineIcon, Heading1, List } from 'lucide-react';

function TipTapEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '<p>Hello from TipTap!</p>',
  });

  if (!editor) return null;

  return (
    <RichTextEditor.Root variant="outline">
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control
            active={editor.isActive('bold')}
            onActiveChange={() => editor.chain().focus().toggleBold().run()}
            aria-label="Bold"
          >
            <Bold size={14} />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            active={editor.isActive('italic')}
            onActiveChange={() => editor.chain().focus().toggleItalic().run()}
            aria-label="Italic"
          >
            <Italic size={14} />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            active={editor.isActive('underline')}
            onActiveChange={() => editor.chain().focus().toggleUnderline().run()}
            aria-label="Underline"
          >
            <UnderlineIcon size={14} />
          </RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
        <RichTextEditor.Separator />
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control
            active={editor.isActive('heading', { level: 1 })}
            onActiveChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            aria-label="Heading 1"
          >
            <Heading1 size={14} />
          </RichTextEditor.Control>
          <RichTextEditor.Control
            active={editor.isActive('bulletList')}
            onActiveChange={() => editor.chain().focus().toggleBulletList().run()}
            aria-label="Bullet list"
          >
            <List size={14} />
          </RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content>
        <EditorContent editor={editor} />
      </RichTextEditor.Content>
    </RichTextEditor.Root>
  );
}`,
      },
      {
        label: 'Install',
        language: 'bash',
        code: `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-underline`,
      },
    ],
  },
  {
    id: 'lexical',
    name: 'Lexical',
    description: 'Integration with @lexical/react. Uses Lexical plugins inside the content area.',
    component: <EditorLoader><LexicalEditor /></EditorLoader>,
    code: [
      {
        label: 'Lexical',
        code: `import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { RichTextEditor } from 'move';
import { Bold, Italic, Underline } from 'lucide-react';

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
        }
      });
    });
  }, [editor]);

  return (
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control
          active={isBold}
          onActiveChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          aria-label="Bold"
        >
          <Bold size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          active={isItalic}
          onActiveChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          aria-label="Italic"
        >
          <Italic size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>
    </RichTextEditor.Toolbar>
  );
}

function LexicalEditor() {
  const initialConfig = {
    namespace: 'MyEditor',
    onError: (error: Error) => console.error(error),
  };

  return (
    <RichTextEditor.Root variant="outline">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextEditor.Content>
          <RichTextPlugin
            contentEditable={<ContentEditable style={{ outline: 'none' }} />}
            placeholder={<div>Start typing...</div>}
          />
        </RichTextEditor.Content>
        <HistoryPlugin />
      </LexicalComposer>
    </RichTextEditor.Root>
  );
}`,
      },
      {
        label: 'Install',
        language: 'bash',
        code: `npm install lexical @lexical/react`,
      },
    ],
  },
  {
    id: 'plate',
    name: 'Plate',
    description: 'Integration with Plate. Uses Plate plugins with Move-styled chrome.',
    component: <EditorLoader><PlateEditor /></EditorLoader>,
    code: [
      {
        label: 'Plate',
        code: `import { Plate, PlateContent, usePlateEditor, useEditorRef, useEditorSelector } from 'platejs/react';
import { BoldPlugin, ItalicPlugin } from '@platejs/basic-nodes/react';
import { RichTextEditor } from 'move';
import { Bold, Italic } from 'lucide-react';

function PlateToolbar() {
  const editor = useEditorRef();
  const isBold = useEditorSelector((e) => !!e.getMarks()?.bold, []);
  const isItalic = useEditorSelector((e) => !!e.getMarks()?.italic, []);

  const toggleMark = (key: string) => {
    const marks = editor.getMarks();
    if (marks?.[key]) {
      editor.removeMark(key);
    } else {
      editor.addMark(key, true);
    }
    editor.focus();
  };

  return (
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control
          active={isBold}
          onActiveChange={() => toggleMark('bold')}
          aria-label="Bold"
        >
          <Bold size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          active={isItalic}
          onActiveChange={() => toggleMark('italic')}
          aria-label="Italic"
        >
          <Italic size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>
    </RichTextEditor.Toolbar>
  );
}

function MyPlateEditor() {
  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin],
  });

  return (
    <Plate editor={editor}>
      <RichTextEditor.Root variant="outline">
        <PlateToolbar />
        <RichTextEditor.Content>
          <PlateContent placeholder="Start typing..." style={{ outline: 'none' }} />
        </RichTextEditor.Content>
      </RichTextEditor.Root>
    </Plate>
  );
}`,
      },
      {
        label: 'Install',
        language: 'bash',
        code: `npm install platejs @platejs/basic-nodes`,
      },
    ],
  },
  {
    id: 'variants',
    name: 'Variants',
    description: 'Outline adds a border and toolbar background. Subtle removes all chrome borders.',
    component: <VariantsExample />,
    code: `<RichTextEditor.Root variant="outline">
  <RichTextEditor.Toolbar>
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control aria-label="Bold"><Bold size={14} /></RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
  </RichTextEditor.Toolbar>
  <RichTextEditor.Content>
    <div contentEditable />
  </RichTextEditor.Content>
</RichTextEditor.Root>

<RichTextEditor.Root variant="subtle">
  <RichTextEditor.Toolbar>
    <RichTextEditor.ControlGroup>
      <RichTextEditor.Control aria-label="Bold"><Bold size={14} /></RichTextEditor.Control>
    </RichTextEditor.ControlGroup>
  </RichTextEditor.Toolbar>
  <RichTextEditor.Content>
    <div contentEditable />
  </RichTextEditor.Content>
</RichTextEditor.Root>`,
  },
];

export function RichTextEditorDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="RichTextEditor"
        description="Engine-agnostic rich text editor chrome. Bring your own editor — TipTap, Lexical, Plate, or a plain contentEditable."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="RichTextEditor.Root"
        properties={[
          { name: 'variant', type: "'outline' | 'subtle'", default: "'outline'", description: 'Visual weight of the editor chrome.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls and spacing size.' },
        ]}
      />

      <DocPage.ApiSection
        title="RichTextEditor.Toolbar"
        properties={[
          { name: 'sticky', type: 'boolean', default: 'false', description: 'Make the toolbar stick to the top on scroll.' },
          { name: 'stickyOffset', type: 'number', description: 'Top offset in pixels when sticky.' },
        ]}
      />

      <DocPage.ApiSection
        title="RichTextEditor.Control"
        properties={[
          { name: 'active', type: 'boolean', description: 'Controlled active (highlighted) state.' },
          { name: 'defaultActive', type: 'boolean', default: 'false', description: 'Initial active state when uncontrolled.' },
          { name: 'onActiveChange', type: '(active: boolean) => void', description: 'Called when the active state changes.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the control.' },
        ]}
      />

      <DocPage.ApiSection
        title="RichTextEditor.Content"
        properties={[
          { name: 'minHeight', type: 'CSS value', description: 'Minimum height of the content area.' },
          { name: 'onFocus', type: 'FocusEventHandler', description: 'Called when the content area receives focus.' },
          { name: 'onBlur', type: 'FocusEventHandler', description: 'Called when the content area loses focus.' },
        ]}
      />
    </DocPage.Root>
  );
}
