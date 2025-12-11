import { Select } from 'move';

export function SelectDemo() {
  return (
    <div className="demo-section">
      <h3>Select</h3>
      <div className="demo-box">
        <Select.Root>
          <Select.Trigger className="select-trigger">
            <Select.Value placeholder="Select a fruit..." />
            <Select.Icon>
              <ChevronDown />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="select-content">
              <Select.ScrollUpButton className="select-scroll-button">
                <ChevronUp />
              </Select.ScrollUpButton>
              <Select.Viewport className="select-viewport">
                <Select.Group>
                  <Select.Label className="select-label">Fruits</Select.Label>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </Select.Group>

                <Select.Separator className="select-separator" />

                <Select.Group>
                  <Select.Label className="select-label">Vegetables</Select.Label>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                  <SelectItem value="broccoli">Broccoli</SelectItem>
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className="select-scroll-button">
                <ChevronDown />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
}

function SelectItem({ value, children }: { value: string; children: string }) {
  return (
    <Select.Item className="select-item" value={value}>
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="select-item-indicator">
        <Check />
      </Select.ItemIndicator>
    </Select.Item>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
