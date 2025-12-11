import { Slider } from 'move';

export function SliderDemo() {
  return (
    <div className="demo-section">
      <h3>Slider</h3>
      <div className="demo-box">
        <div style={{ maxWidth: 300 }}>
          <Slider.Root className="slider-root" defaultValue={[50]} max={100} step={1}>
            <Slider.Track className="slider-track">
              <Slider.Range className="slider-range" />
            </Slider.Track>
            <Slider.Thumb className="slider-thumb" />
          </Slider.Root>
        </div>
        <p style={{ color: '#888', fontSize: 14, marginTop: 16 }}>Single value slider</p>

        <div style={{ maxWidth: 300, marginTop: 24 }}>
          <Slider.Root className="slider-root" defaultValue={[25, 75]} max={100} step={1}>
            <Slider.Track className="slider-track">
              <Slider.Range className="slider-range" />
            </Slider.Track>
            <Slider.Thumb className="slider-thumb" />
            <Slider.Thumb className="slider-thumb" />
          </Slider.Root>
        </div>
        <p style={{ color: '#888', fontSize: 14, marginTop: 16 }}>Range slider</p>
      </div>
    </div>
  );
}
