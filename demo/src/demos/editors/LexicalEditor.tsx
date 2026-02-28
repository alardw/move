import { useState, useEffect, useCallback } from 'react';
import './lexical-theme.css';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListItemNode, ListNode, $isListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { $generateNodesFromDOM } from '@lexical/html';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $getRoot,
  $insertNodes,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FOCUS_COMMAND,
  BLUR_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  type ElementFormatType,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { RichTextEditor, Prose } from 'move';
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

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [isCheckList, setIsCheckList] = useState(false);
  const [isBlockquote, setIsBlockquote] = useState(false);
  const [isCodeBlock, setIsCodeBlock] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [activeAlign, setActiveAlign] = useState('left');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    const unregFocus = editor.registerCommand(FOCUS_COMMAND, () => { setHasFocus(true); return false; }, COMMAND_PRIORITY_LOW);
    const unregBlur = editor.registerCommand(BLUR_COMMAND, () => { setHasFocus(false); return false; }, COMMAND_PRIORITY_LOW);
    return () => { unregFocus(); unregBlur(); };
  }, [editor]);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsHighlight(selection.hasFormat('highlight'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));

      const anchorNode = selection.anchor.getNode();
      const topElement = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      if ($isHeadingNode(topElement)) {
        setActiveHeading(topElement.getTag());
      } else {
        setActiveHeading('');
      }

      if ($isElementNode(topElement)) {
        const format = topElement.getFormatType();
        setActiveAlign(format || 'left');
      }

      // Walk up parents to detect list, blockquote, code block
      let foundList = '';
      let foundQuote = false;
      let foundCodeBlock = false;
      let node = anchorNode.getParent();
      while (node !== null) {
        if ($isListNode(node)) {
          const listType = node.getListType();
          if (listType === 'bullet') foundList = 'bullet';
          else if (listType === 'number') foundList = 'number';
          else if (listType === 'check') foundList = 'check';
        }
        if ($isQuoteNode(node)) foundQuote = true;
        if (node.getType() === 'code') foundCodeBlock = true;
        node = node.getParent();
      }
      setIsBulletList(foundList === 'bullet');
      setIsOrderedList(foundList === 'number');
      setIsCheckList(foundList === 'check');
      setIsBlockquote(foundQuote);
      setIsCodeBlock(foundCodeBlock);

      const parent = anchorNode.getParent();
      setIsLink(parent !== null && parent.getType() === 'link');
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => updateToolbar());
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(CAN_UNDO_COMMAND, (payload) => { setCanUndo(payload); return false; }, COMMAND_PRIORITY_CRITICAL);
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(CAN_REDO_COMMAND, (payload) => { setCanRedo(payload); return false; }, COMMAND_PRIORITY_CRITICAL);
  }, [editor]);

  const dispatch = <T,>(command: import('lexical').LexicalCommand<T>, payload: T) => {
    editor.dispatchCommand(command, payload);
    editor.focus();
  };

  const formatHeading = (tag: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
    editor.focus();
  };

  const setLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      const url = window.prompt('URL');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
      }
    }
    editor.focus();
  };

  return (
    <RichTextEditor.Toolbar>
      {/* Marks */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && isBold} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'bold')} aria-label="Bold" title="Bold">
          <Bold size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isItalic} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'italic')} aria-label="Italic" title="Italic">
          <Italic size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isUnderline} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'underline')} aria-label="Underline" title="Underline">
          <Underline size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isStrikethrough} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'strikethrough')} aria-label="Strikethrough" title="Strikethrough">
          <Strikethrough size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isCode} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'code')} aria-label="Inline code" title="Inline code">
          <Code size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isHighlight} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'highlight')} aria-label="Highlight" title="Highlight">
          <Highlighter size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isSubscript} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'subscript')} aria-label="Subscript" title="Subscript">
          <Subscript size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isSuperscript} onActiveChange={() => dispatch(FORMAT_TEXT_COMMAND, 'superscript')} aria-label="Superscript" title="Superscript">
          <Superscript size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Headings */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h1'} onActiveChange={() => formatHeading('h1')} aria-label="Heading 1" title="Heading 1">
          <Heading1 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h2'} onActiveChange={() => formatHeading('h2')} aria-label="Heading 2" title="Heading 2">
          <Heading2 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeHeading === 'h3'} onActiveChange={() => formatHeading('h3')} aria-label="Heading 3" title="Heading 3">
          <Heading3 size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Lists & blocks */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && isBulletList} onActiveChange={() => dispatch(INSERT_UNORDERED_LIST_COMMAND, undefined)} aria-label="Bullet list" title="Bullet list">
          <List size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isOrderedList} onActiveChange={() => dispatch(INSERT_ORDERED_LIST_COMMAND, undefined)} aria-label="Ordered list" title="Ordered list">
          <ListOrdered size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && isCheckList} onActiveChange={() => dispatch(INSERT_CHECK_LIST_COMMAND, undefined)} aria-label="Task list" title="Task list">
          <ListChecks size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          active={hasFocus && isBlockquote}
          onActiveChange={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
              }
            });
          }}
          aria-label="Blockquote"
          title="Blockquote"
        >
          <Quote size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control
          active={hasFocus && isCodeBlock}
          onActiveChange={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createCodeNode());
              }
            });
          }}
          aria-label="Code block"
          title="Code block"
        >
          <Code2 size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => dispatch(INSERT_HORIZONTAL_RULE_COMMAND, undefined)} aria-label="Horizontal rule" title="Horizontal rule">
          <Minus size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Indent */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => dispatch(INDENT_CONTENT_COMMAND, undefined)} aria-label="Indent" title="Indent">
          <Indent size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => dispatch(OUTDENT_CONTENT_COMMAND, undefined)} aria-label="Outdent" title="Outdent">
          <Outdent size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Alignment */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && activeAlign === 'left'} onActiveChange={() => dispatch(FORMAT_ELEMENT_COMMAND, 'left' as ElementFormatType)} aria-label="Align left" title="Align left">
          <AlignLeft size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeAlign === 'center'} onActiveChange={() => dispatch(FORMAT_ELEMENT_COMMAND, 'center' as ElementFormatType)} aria-label="Align center" title="Align center">
          <AlignCenter size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeAlign === 'right'} onActiveChange={() => dispatch(FORMAT_ELEMENT_COMMAND, 'right' as ElementFormatType)} aria-label="Align right" title="Align right">
          <AlignRight size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control active={hasFocus && activeAlign === 'justify'} onActiveChange={() => dispatch(FORMAT_ELEMENT_COMMAND, 'justify' as ElementFormatType)} aria-label="Justify" title="Justify">
          <AlignJustify size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* Link */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control active={hasFocus && isLink} onActiveChange={setLink} aria-label="Link" title="Link">
          <LinkIcon size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => dispatch(TOGGLE_LINK_COMMAND, null)} disabled={!hasFocus || !isLink} aria-label="Unlink" title="Unlink">
          <Unlink size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>

      <RichTextEditor.Separator />

      {/* History */}
      <RichTextEditor.ControlGroup>
        <RichTextEditor.Control onClick={() => dispatch(UNDO_COMMAND, undefined)} disabled={!canUndo} aria-label="Undo" title="Undo">
          <Undo size={14} />
        </RichTextEditor.Control>
        <RichTextEditor.Control onClick={() => dispatch(REDO_COMMAND, undefined)} disabled={!canRedo} aria-label="Redo" title="Redo">
          <Redo size={14} />
        </RichTextEditor.Control>
      </RichTextEditor.ControlGroup>
    </RichTextEditor.Toolbar>
  );
}

const theme = {
  heading: { h1: 'lexical-h1', h2: 'lexical-h2', h3: 'lexical-h3' },
  text: {
    bold: 'lexical-bold',
    italic: 'lexical-italic',
    underline: 'lexical-underline',
    strikethrough: 'lexical-strikethrough',
    code: 'lexical-code',
    highlight: 'lexical-highlight',
    subscript: 'lexical-subscript',
    superscript: 'lexical-superscript',
  },
  list: { ul: 'lexical-ul', ol: 'lexical-ol', listitem: 'lexical-li', checklist: 'lexical-checklist' },
  quote: 'lexical-quote',
  code: 'lexical-code-block',
  link: 'lexical-link',
  hr: 'lexical-hr',
};

const initialHtml = `
<h1>The Craft of Writing</h1>
<p>Good writing is <b>clear</b>, <i>purposeful</i>, and <u>well-structured</u>. Whether you're drafting a report, composing an email, or writing documentation — the same principles apply.</p>
<h2>Formatting Essentials</h2>
<p>Use <b>bold</b> for emphasis, <i>italic</i> for titles and terms, and <code>inline code</code> keeps things readable. You can also use <s>strikethrough</s> to show revisions.</p>
<h3>Structuring Content</h3>
<p>Break your text into logical sections with headings. Use lists to organize related items:</p>
<ul><li>Bullet lists for unordered items</li><li>Numbered lists for sequential steps</li><li>Task lists for actionable items</li></ul>
<ol><li>First, outline your main points</li><li>Then, expand each section with detail</li><li>Finally, review and revise</li></ol>
<blockquote>The most valuable of all talents is that of never using two words when one will do. — Thomas Jefferson</blockquote>
<hr>
<h2>Alignment &amp; Layout</h2>
<p>Text alignment helps guide the reader's eye. Left-aligned text is standard for body copy. Centered text works for headings and short callouts. Right-aligned text suits dates and signatures.</p>
<p>The toolbar above lets you experiment with all of these options. Select any text and try the controls — <b>this is your sandbox</b>. For more tips, visit <a href="https://example.com">this guide</a>.</p>`;

export function LexicalEditor() {
  const initialConfig = {
    namespace: 'MoveDemo',
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, CodeNode, CodeHighlightNode, LinkNode, AutoLinkNode, HorizontalRuleNode],
    onError: (error: Error) => console.error(error),
    editorState: (editor: import('lexical').LexicalEditor) => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    },
  };

  return (
    <RichTextEditor.Root variant="outline">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextEditor.Content>
          <Prose>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  style={{ outline: 'none', minHeight: 120 }}
                  aria-placeholder="Start typing..."
                  placeholder={() => null}
                />
              }
              placeholder={
                <div style={{
                  color: 'var(--move-fg-muted)',
                  position: 'absolute',
                  top: 'var(--move-rte-content-padding)',
                  left: 'var(--move-rte-content-padding)',
                  pointerEvents: 'none',
                }}>
                  Start typing in the Lexical editor...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
          </Prose>
        </RichTextEditor.Content>
      </LexicalComposer>
    </RichTextEditor.Root>
  );
}
