import { RichTextEditor, Prose } from 'move';
import { Plate, PlateContent, usePlateEditor, useEditorRef, useEditorSelector, useFocused } from 'platejs/react';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  HighlightPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  CodePlugin,
  H1Plugin,
  H2Plugin,
  H3Plugin,
  BlockquotePlugin,
} from '@platejs/basic-nodes/react';
import { CodeBlockPlugin } from '@platejs/code-block/react';
import { IndentPlugin } from '@platejs/indent/react';
import { ListPlugin } from '@platejs/list/react';
import { ListStyleType, toggleList } from '@platejs/list';
import { indent, outdent } from '@platejs/indent';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Subscript,
  Superscript,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Indent,
  Outdent,
  Undo,
  Redo,
} from 'lucide-react';

function PlateToolbar() {
  const editor = useEditorRef() as any;
  const hasFocus = useFocused();
  const isBold = useEditorSelector((e: any) => !!e.getMarks()?.bold, []);
  const isItalic = useEditorSelector((e: any) => !!e.getMarks()?.italic, []);
  const isUnderline = useEditorSelector((e: any) => !!e.getMarks()?.underline, []);
  const isStrikethrough = useEditorSelector((e: any) => !!e.getMarks()?.strikethrough, []);
  const isCode = useEditorSelector((e: any) => !!e.getMarks()?.code, []);
  const isHighlight = useEditorSelector((e: any) => !!e.getMarks()?.highlight, []);
  const isSubscript = useEditorSelector((e: any) => !!e.getMarks()?.subscript, []);
  const isSuperscript = useEditorSelector((e: any) => !!e.getMarks()?.superscript, []);

  const activeHeading = useEditorSelector((e: any) => {
    const entry = e.above({ match: { type: ['h1', 'h2', 'h3'] } });
    return entry ? (entry[0] as any).type : '';
  }, []);

  const isBlockquote = useEditorSelector((e: any) => {
    return !!e.above({ match: { type: 'blockquote' } });
  }, []);

  const isCodeBlock = useEditorSelector((e: any) => {
    return !!e.above({ match: { type: 'code_block' } });
  }, []);

  const isBulletList = useEditorSelector((e: any) => {
    const entry = e.above();
    return entry ? (entry[0] as any).listStyleType === 'disc' : false;
  }, []);

  const isOrderedList = useEditorSelector((e: any) => {
    const entry = e.above();
    return entry ? (entry[0] as any).listStyleType === 'decimal' : false;
  }, []);

  const toggleMark = (key: string) => {
    const marks = editor.getMarks();
    if (marks?.[key]) {
      editor.removeMark(key);
    } else {
      editor.addMark(key, true);
    }
    editor.focus();
  };

  const toggleBlock = (type: string) => {
    const entry = editor.above({ match: { type } });
    editor.setNodes(entry ? { type: 'p' } : { type });
    editor.focus();
  };

  const handleHeading = (val: string) => {
    if (val === activeHeading) {
      editor.setNodes({ type: 'p' });
    } else {
      editor.setNodes({ type: val });
    }
    editor.focus();
  };

  return (
    <RichTextEditor.Toolbar>
      {/* Marks */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && isBold} onActiveChange={() => toggleMark('bold')} aria-label="Bold" title="Bold">
          <Bold size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isItalic} onActiveChange={() => toggleMark('italic')} aria-label="Italic" title="Italic">
          <Italic size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isUnderline} onActiveChange={() => toggleMark('underline')} aria-label="Underline" title="Underline">
          <Underline size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isStrikethrough} onActiveChange={() => toggleMark('strikethrough')} aria-label="Strikethrough" title="Strikethrough">
          <Strikethrough size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isCode} onActiveChange={() => toggleMark('code')} aria-label="Inline code" title="Inline code">
          <Code size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isHighlight} onActiveChange={() => toggleMark('highlight')} aria-label="Highlight" title="Highlight">
          <Highlighter size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isSubscript} onActiveChange={() => toggleMark('subscript')} aria-label="Subscript" title="Subscript">
          <Subscript size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isSuperscript} onActiveChange={() => toggleMark('superscript')} aria-label="Superscript" title="Superscript">
          <Superscript size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Headings */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h1'} onActiveChange={() => handleHeading('h1')} aria-label="Heading 1" title="Heading 1">
          <Heading1 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h2'} onActiveChange={() => handleHeading('h2')} aria-label="Heading 2" title="Heading 2">
          <Heading2 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h3'} onActiveChange={() => handleHeading('h3')} aria-label="Heading 3" title="Heading 3">
          <Heading3 size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Lists & blocks */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && isBulletList} onActiveChange={() => { toggleList(editor, { type: ListStyleType.Disc }); editor.focus(); }} aria-label="Bullet list" title="Bullet list">
          <List size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isOrderedList} onActiveChange={() => { toggleList(editor, { type: ListStyleType.Decimal }); editor.focus(); }} aria-label="Ordered list" title="Ordered list">
          <ListOrdered size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isBlockquote} onActiveChange={() => toggleBlock('blockquote')} aria-label="Blockquote" title="Blockquote">
          <Quote size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isCodeBlock} onActiveChange={() => toggleBlock('code_block')} aria-label="Code block" title="Code block">
          <Code2 size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Indent */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => { indent(editor); editor.focus(); }} aria-label="Indent" title="Indent">
          <Indent size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => { outdent(editor); editor.focus(); }} aria-label="Outdent" title="Outdent">
          <Outdent size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* History */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => { editor.undo(); editor.focus(); }} aria-label="Undo" title="Undo">
          <Undo size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => { editor.redo(); editor.focus(); }} aria-label="Redo" title="Redo">
          <Redo size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>
    </RichTextEditor.Toolbar>
  );
}

export function PlateEditor() {
  const editor = usePlateEditor({
    plugins: [
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
      StrikethroughPlugin,
      CodePlugin,
      HighlightPlugin,
      SubscriptPlugin,
      SuperscriptPlugin,
      H1Plugin,
      H2Plugin,
      H3Plugin,
      BlockquotePlugin,
      CodeBlockPlugin,
      IndentPlugin,
      ListPlugin,
    ],
    value: [
      { type: 'h1', children: [{ text: 'The Craft of Writing' }] },
      { type: 'p', children: [
        { text: 'Good writing is ' },
        { text: 'clear', bold: true },
        { text: ', ' },
        { text: 'purposeful', italic: true },
        { text: ', and ' },
        { text: 'well-structured', underline: true },
        { text: '. Whether you\'re drafting a report, composing an email, or writing documentation — the same principles apply.' },
      ] },
      { type: 'h2', children: [{ text: 'Formatting Essentials' }] },
      { type: 'p', children: [
        { text: 'Use ' },
        { text: 'bold', bold: true },
        { text: ' for emphasis, ' },
        { text: 'italic', italic: true },
        { text: ' for titles and terms, and ' },
        { text: 'highlight', highlight: true },
        { text: ' to draw attention to key phrases. For technical content, ' },
        { text: 'inline code', code: true },
        { text: ' keeps things readable. You can also use ' },
        { text: 'strikethrough', strikethrough: true },
        { text: ' to show revisions.' },
      ] },
      { type: 'h3', children: [{ text: 'Structuring Content' }] },
      { type: 'p', children: [{ text: 'Break your text into logical sections with headings. Use lists to organize related items:' }] },
      { type: 'p', indent: 1, listStyleType: 'disc', children: [{ text: 'Bullet lists for unordered items' }] },
      { type: 'p', indent: 1, listStyleType: 'disc', children: [{ text: 'Numbered lists for sequential steps' }] },
      { type: 'p', indent: 1, listStyleType: 'disc', children: [{ text: 'Task lists for actionable items' }] },
      { type: 'p', indent: 1, listStyleType: 'decimal', children: [{ text: 'First, outline your main points' }] },
      { type: 'p', indent: 1, listStyleType: 'decimal', children: [{ text: 'Then, expand each section with detail' }] },
      { type: 'p', indent: 1, listStyleType: 'decimal', children: [{ text: 'Finally, review and revise' }] },
      { type: 'blockquote', children: [{ text: '"The most valuable of all talents is that of never using two words when one will do." — Thomas Jefferson' }] },
      { type: 'h2', children: [{ text: 'Your Sandbox' }] },
      { type: 'p', children: [
        { text: 'The toolbar above lets you experiment with all of these options. Select any text and try the controls — ' },
        { text: 'this is your sandbox', bold: true },
        { text: '.' },
      ] },
    ],
  });

  return (
    <Plate editor={editor}>
      <RichTextEditor.Root variant="outline">
        <PlateToolbar />
        <RichTextEditor.Content>
          <Prose>
            <PlateContent
              placeholder="Start typing in the Plate editor..."
              style={{ outline: 'none', minHeight: 120 }}
            />
          </Prose>
        </RichTextEditor.Content>
      </RichTextEditor.Root>
    </Plate>
  );
}
