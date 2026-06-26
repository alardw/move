import { Stack, Heading, Text } from 'move';

/**
 * Standard H2 section used across every docs page. Composed from Move
 * primitives so spacing + typography stay consistent with the rest of
 * the docs. Pass `id` to make the section a scroll-spy target for the
 * TOC rail — placed on the Heading so IntersectionObserver can track it.
 */
export function Section({
  id,
  title,
  lede,
  children,
}: {
  id?: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Heading level={2} id={id}>
          {title}
        </Heading>
        {lede && <Text color="muted">{lede}</Text>}
      </Stack>
      {children}
    </Stack>
  );
}
