import { AlertDialog } from 'move';

export function AlertDialogDemo() {
  return (
    <div className="demo-section">
      <h3>Alert Dialog</h3>
      <div className="demo-box">
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="demo-button">Delete Account</button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="dialog-overlay" />
            <AlertDialog.Content className="dialog-content">
              <AlertDialog.Title className="dialog-title">Are you absolutely sure?</AlertDialog.Title>
              <AlertDialog.Description className="dialog-description">
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialog.Description>
              <div className="dialog-buttons">
                <AlertDialog.Cancel asChild>
                  <button className="demo-button-outline">Cancel</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button className="demo-button" style={{ background: '#dc2626' }}>
                    Yes, delete account
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
}
