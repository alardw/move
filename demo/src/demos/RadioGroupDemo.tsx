import { RadioGroup } from 'move';

export function RadioGroupDemo() {
  return (
    <div className="demo-section">
      <h3>Radio Group</h3>
      <div className="demo-box">
        <RadioGroup.Root className="radio-group-root" defaultValue="comfortable">
          <label className="radio-label">
            <RadioGroup.Item className="radio-item" value="default">
              <RadioGroup.Indicator className="radio-indicator" />
            </RadioGroup.Item>
            <span>Default</span>
          </label>
          <label className="radio-label">
            <RadioGroup.Item className="radio-item" value="comfortable">
              <RadioGroup.Indicator className="radio-indicator" />
            </RadioGroup.Item>
            <span>Comfortable</span>
          </label>
          <label className="radio-label">
            <RadioGroup.Item className="radio-item" value="compact">
              <RadioGroup.Indicator className="radio-indicator" />
            </RadioGroup.Item>
            <span>Compact</span>
          </label>
        </RadioGroup.Root>
      </div>
    </div>
  );
}
