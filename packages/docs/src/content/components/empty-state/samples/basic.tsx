import { Button, EmptyState } from 'move';

export default function BasicSample() {
  return (
    <EmptyState
      icon="inbox"
      title="No invitations yet"
      description="When teammates invite you to projects, they’ll show up here. You can also invite yourself by pasting an invite link."
      action={<Button>Paste invite link</Button>}
    />
  );
}
