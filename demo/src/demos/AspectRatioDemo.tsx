import { AspectRatio } from 'move';

export function AspectRatioDemo() {
  return (
    <div className="demo-section">
      <h3>Aspect Ratio</h3>
      <div className="demo-box">
        <div style={{ width: 300 }}>
          <AspectRatio ratio={16 / 9} className="aspect-ratio-root">
            <img
              className="aspect-ratio-content"
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=600"
              alt="Landscape"
            />
          </AspectRatio>
        </div>
        <p style={{ color: '#888', fontSize: 14, marginTop: 12 }}>16:9 Aspect Ratio</p>
      </div>
    </div>
  );
}
