import { useState } from 'react';
import { Button, Dropdown, Icon } from 'move';

export default function CheckboxRadioSample() {
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [zoom, setZoom] = useState('100');

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">
          View <Icon name="chevron-down" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Label>Toggles</Dropdown.Label>
        <Dropdown.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
          Show grid
        </Dropdown.CheckboxItem>
        <Dropdown.CheckboxItem checked={showRulers} onCheckedChange={setShowRulers}>
          Show rulers
        </Dropdown.CheckboxItem>
        <Dropdown.Separator />
        <Dropdown.Label>Zoom</Dropdown.Label>
        <Dropdown.RadioGroup value={zoom} onValueChange={setZoom}>
          <Dropdown.RadioItem value="50">50%</Dropdown.RadioItem>
          <Dropdown.RadioItem value="100">100%</Dropdown.RadioItem>
          <Dropdown.RadioItem value="150">150%</Dropdown.RadioItem>
          <Dropdown.RadioItem value="200">200%</Dropdown.RadioItem>
        </Dropdown.RadioGroup>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
