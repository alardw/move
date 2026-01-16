import { Slider } from 'move';
import { DocPage, type Example } from '../components/DocPage';

// =============================================================================
// Example Components
// =============================================================================

function SingleExample() {
  return (
    <div style={{ maxWidth: 300 }}>
      <Slider.Root className="slider-root" defaultValue={[50]} max={100} step={1}>
        <Slider.Track className="slider-track">
          <Slider.Range className="slider-range" />
        </Slider.Track>
        <Slider.Thumb className="slider-thumb" />
      </Slider.Root>
    </div>
  );
}

function RangeExample() {
  return (
    <div style={{ maxWidth: 300 }}>
      <Slider.Root className="slider-root" defaultValue={[25, 75]} max={100} step={1}>
        <Slider.Track className="slider-track">
          <Slider.Range className="slider-range" />
        </Slider.Track>
        <Slider.Thumb className="slider-thumb" />
        <Slider.Thumb className="slider-thumb" />
      </Slider.Root>
    </div>
  );
}

// =============================================================================
// Examples Config
// =============================================================================

const examples: Example[] = [
  {
    id: 'single',
    name: 'Single Value',
    description: 'Slider with one thumb.',
    component: <SingleExample />,
    code: `<Slider.Root defaultValue={[50]} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
</Slider.Root>`,
  },
  {
    id: 'range',
    name: 'Range',
    description: 'Slider with two thumbs for selecting a range.',
    component: <RangeExample />,
    code: `<Slider.Root defaultValue={[25, 75]} max={100} step={1}>
  <Slider.Track>
    <Slider.Range />
  </Slider.Track>
  <Slider.Thumb />
  <Slider.Thumb />
</Slider.Root>`,
  },
];

// =============================================================================
// Demo Component
// =============================================================================

export function SliderDemo() {
  return (
    <DocPage.Root defaultExample="single">
      <DocPage.Header
        title="Slider"
        description="An input for selecting a value from a range."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
