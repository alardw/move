import { useState, useRef } from 'react';
import { Toast } from 'move';

export function ToastDemo() {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);

  return (
    <div className="demo-section">
      <h3>Toast</h3>
      <div className="demo-box">
        <Toast.Provider swipeDirection="right">
          <button
            className="demo-button"
            onClick={() => {
              setOpen(false);
              window.clearTimeout(timerRef.current);
              timerRef.current = window.setTimeout(() => {
                setOpen(true);
              }, 100);
            }}
          >
            Add to calendar
          </button>

          <Toast.Root className="toast-root" open={open} onOpenChange={setOpen}>
            <Toast.Title className="toast-title">Scheduled: Catch up</Toast.Title>
            <Toast.Description className="toast-description">
              Friday, February 10, 2024 at 5:57 PM
            </Toast.Description>
            <Toast.Action className="toast-action" asChild altText="Undo">
              <button className="demo-button-outline" style={{ padding: '6px 12px', fontSize: 12 }}>
                Undo
              </button>
            </Toast.Action>
          </Toast.Root>
          <Toast.Viewport className="toast-viewport" />
        </Toast.Provider>
      </div>
    </div>
  );
}
