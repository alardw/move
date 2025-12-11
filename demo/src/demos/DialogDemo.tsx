import { Dialog } from 'move';

export function DialogDemo() {
  return (
    <div className="demo-section">
      <h3>Dialog</h3>
      <div className="demo-box">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="demo-button">Edit Profile</button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content">
              <Dialog.Title className="dialog-title">Edit profile</Dialog.Title>
              <Dialog.Description className="dialog-description">
                Make changes to your profile here. Click save when you're done.
              </Dialog.Description>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#ccc' }}>Name</label>
                  <input className="demo-input" defaultValue="John Doe" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#ccc' }}>Username</label>
                  <input className="demo-input" defaultValue="@johndoe" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="dialog-buttons">
                <Dialog.Close asChild>
                  <button className="demo-button">Save changes</button>
                </Dialog.Close>
              </div>
              <Dialog.Close className="dialog-close">
                <X />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

function X() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
