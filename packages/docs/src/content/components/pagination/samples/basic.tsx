import { useState } from 'react';
import { Pagination, Stack, Text } from 'move';

export default function BasicSample() {
  const [page, setPage] = useState(1);
  return (
    <Stack gap="sm" align="start">
      <Pagination.Root total={42} page={page} onChange={setPage}>
        <Pagination.PrevTrigger />
        <Pagination.Items />
        <Pagination.NextTrigger />
      </Pagination.Root>
      <Text size="sm" color="muted">page: {page} of 42</Text>
    </Stack>
  );
}
