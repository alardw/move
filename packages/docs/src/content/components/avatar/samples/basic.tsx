import { Avatar, Stack } from 'move';

export default function BasicSample() {
  return (
    <Stack direction="row" gap="md" align="center">
      <Avatar.Root>
        <Avatar.Image src="https://i.pravatar.cc/96?img=8" alt="Alex Smith" />
        <Avatar.Fallback>AS</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Image src="https://does-not-exist.example/none.jpg" alt="Jamie Chen" />
        <Avatar.Fallback>JC</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Fallback>MK</Avatar.Fallback>
      </Avatar.Root>
    </Stack>
  );
}
