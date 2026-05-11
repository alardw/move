import { Alert } from 'move';

export default function BasicSample() {
  return (
    <Alert title="Heads up">
      Backups now run hourly instead of nightly. Older nightly snapshots stay
      available for 30 days, then they’re cleaned up automatically.
    </Alert>
  );
}
