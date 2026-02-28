import { useEditor, useEditorState, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExt from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { RichTextEditor, Prose } from 'move';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Minus,
  LinkIcon,
  Unlink,
  Indent,
  Outdent,
  Undo,
  Redo,
} from 'lucide-react';

function TipTapToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: (ctx: { editor: Editor }) => {
      const e = ctx.editor;
      const f = e.isFocused;
      return {
        bold: f && e.isActive('bold'),
        italic: f && e.isActive('italic'),
        underline: f && e.isActive('underline'),
        strike: f && e.isActive('strike'),
        code: f && e.isActive('code'),
        highlight: f && e.isActive('highlight'),
        subscript: f && e.isActive('subscript'),
        superscript: f && e.isActive('superscript'),
        h1: f && e.isActive('heading', { level: 1 }),
        h2: f && e.isActive('heading', { level: 2 }),
        h3: f && e.isActive('heading', { level: 3 }),
        bulletList: f && e.isActive('bulletList'),
        orderedList: f && e.isActive('orderedList'),
        taskList: f && e.isActive('taskList'),
        blockquote: f && e.isActive('blockquote'),
        codeBlock: f && e.isActive('codeBlock'),
        alignLeft: f && e.isActive({ textAlign: 'left' }),
        alignCenter: f && e.isActive({ textAlign: 'center' }),
        alignRight: f && e.isActive({ textAlign: 'right' }),
        alignJustify: f && e.isActive({ textAlign: 'justify' }),
        link: f && e.isActive('link'),
        canUndo: e.can().undo(),
        canRedo: e.can().redo(),
      };
    },
  });

  const setLink = () => {
    const url = window.prompt('URL', editor.getAttributes('link').href || '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <RichTextEditor.Toolbar>
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={state.bold} onActiveChange={() => editor.chain().focus().toggleBold().run()} aria-label="Bold" title="Bold">
          <Bold size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.italic} onActiveChange={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic" title="Italic">
          <Italic size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.underline} onActiveChange={() => editor.chain().focus().toggleUnderline().run()} aria-label="Underline" title="Underline">
          <Underline size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.strike} onActiveChange={() => editor.chain().focus().toggleStrike().run()} aria-label="Strikethrough" title="Strikethrough">
          <Strikethrough size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.code} onActiveChange={() => editor.chain().focus().toggleCode().run()} aria-label="Inline code" title="Inline code">
          <Code size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.highlight} onActiveChange={() => editor.chain().focus().toggleHighlight().run()} aria-label="Highlight" title="Highlight">
          <Highlighter size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.subscript} onActiveChange={() => editor.chain().focus().toggleSubscript().run()} aria-label="Subscript" title="Subscript">
          <SubscriptIcon size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.superscript} onActiveChange={() => editor.chain().focus().toggleSuperscript().run()} aria-label="Superscript" title="Superscript">
          <SuperscriptIcon size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={state.h1} onActiveChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} aria-label="Heading 1" title="Heading 1">
          <Heading1 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.h2} onActiveChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} aria-label="Heading 2" title="Heading 2">
          <Heading2 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.h3} onActiveChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} aria-label="Heading 3" title="Heading 3">
          <Heading3 size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={state.bulletList} onActiveChange={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bullet list" title="Bullet list">
          <List size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.orderedList} onActiveChange={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Ordered list" title="Ordered list">
          <ListOrdered size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.taskList} onActiveChange={() => editor.chain().focus().toggleTaskList().run()} aria-label="Task list" title="Task list">
          <ListChecks size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.blockquote} onActiveChange={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Blockquote" title="Blockquote">
          <Quote size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.codeBlock} onActiveChange={() => editor.chain().focus().toggleCodeBlock().run()} aria-label="Code block" title="Code block">
          <Code2 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="Horizontal rule" title="Horizontal rule">
          <Minus size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => editor.chain().focus().sinkListItem('listItem').run()} aria-label="Indent" title="Indent">
          <Indent size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => editor.chain().focus().liftListItem('listItem').run()} aria-label="Outdent" title="Outdent">
          <Outdent size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={state.alignLeft} onActiveChange={() => editor.chain().focus().setTextAlign('left').run()} aria-label="Align left" title="Align left">
          <AlignLeft size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.alignCenter} onActiveChange={() => editor.chain().focus().setTextAlign('center').run()} aria-label="Align center" title="Align center">
          <AlignCenter size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.alignRight} onActiveChange={() => editor.chain().focus().setTextAlign('right').run()} aria-label="Align right" title="Align right">
          <AlignRight size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={state.alignJustify} onActiveChange={() => editor.chain().focus().setTextAlign('justify').run()} aria-label="Justify" title="Justify">
          <AlignJustify size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={state.link} onActiveChange={setLink} aria-label="Link" title="Link">
          <LinkIcon size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => editor.chain().focus().unsetLink().run()} disabled={!state.link} aria-label="Unlink" title="Unlink">
          <Unlink size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => editor.chain().focus().undo().run()} disabled={!state.canUndo} aria-label="Undo" title="Undo">
          <Undo size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => editor.chain().focus().redo().run()} disabled={!state.canRedo} aria-label="Redo" title="Redo">
          <Redo size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>
    </RichTextEditor.Toolbar>
  );
}

export function TipTapEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      UnderlineExt,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Subscript,
      Superscript,
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: `
<h1>The Craft of Writing</h1>
<p>Good writing is <strong>clear</strong>, <em>purposeful</em>, and <u>well-structured</u>. Whether you're drafting a report, composing an email, or writing documentation — the same principles apply.</p>
<h2>Formatting Essentials</h2>
<p>Use <strong>bold</strong> for emphasis, <em>italic</em> for titles and terms, and <mark>highlight</mark> to draw attention to key phrases. For technical content, <code>inline code</code> keeps things readable. You can also use <s>strikethrough</s> to show revisions.</p>
<h3>Structuring Content</h3>
<p>Break your text into logical sections with headings. Use lists to organize related items:</p>
<ul><li>Bullet lists for unordered items</li><li>Numbered lists for sequential steps</li><li>Task lists for actionable items</li></ul>
<ol><li>First, outline your main points</li><li>Then, expand each section with detail</li><li>Finally, review and revise</li></ol>
<blockquote><p>"The most valuable of all talents is that of never using two words when one will do." — Thomas Jefferson</p></blockquote>
<hr>
<h2>Alignment &amp; Layout</h2>
<p>Text alignment helps guide the reader's eye. Left-aligned text is standard for body copy. Centered text works for headings and short callouts. Right-aligned text suits dates and signatures.</p>
<p>The toolbar above lets you experiment with all of these options. Select any text and try the controls — <strong>this is your sandbox</strong>. For more tips, visit <a href="https://example.com">this guide</a>.</p>`,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextEditor.Root variant="outline">
      <TipTapToolbar editor={editor} />
      <RichTextEditor.Content>
        <Prose>
          <EditorContent editor={editor} />
        </Prose>
      </RichTextEditor.Content>
    </RichTextEditor.Root>
  );
}
