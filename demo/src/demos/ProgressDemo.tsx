import { useState, useEffect } from 'react';
import { Progress } from 'move';

export function ProgressDemo() {
  const [progress, setProgress] = useState(13);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 10;
      });
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="demo-section">
      <h3>Progress</h3>
      <div className="demo-box">
        <Progress.Root className="progress-root" value={progress}>
          <Progress.Indicator
            className="progress-indicator"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </Progress.Root>
        <p style={{ color: '#888', fontSize: 14, marginTop: 12 }}>
          {Math.round(Math.min(progress, 100))}% complete
        </p>
      </div>
    </div>
  );
}
