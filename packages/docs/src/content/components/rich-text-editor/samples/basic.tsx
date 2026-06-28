import { RichTextEditor } from 'move';

export default function BasicSample() {
  return (
    <RichTextEditor.Root>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control>B</RichTextEditor.Control>
          <RichTextEditor.Control>I</RichTextEditor.Control>
          <RichTextEditor.Control>U</RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
        <RichTextEditor.Separator />
        <RichTextEditor.ControlGroup>
          <RichTextEditor.Control>H1</RichTextEditor.Control>
          <RichTextEditor.Control>H2</RichTextEditor.Control>
        </RichTextEditor.ControlGroup>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content>
        {/* recipe-purity-ignore: editor body content is authored as raw HTML — that's the editor's purpose */}
        <p>Type here. Try <strong>Cmd+B</strong> for bold, <strong>Cmd+I</strong> for italic, or use the toolbar above.</p>
      </RichTextEditor.Content>
    </RichTextEditor.Root>
  );
}
