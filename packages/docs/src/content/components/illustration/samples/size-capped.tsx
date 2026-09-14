import { Illustration, Link, Text } from 'move';
import SitStandWalk from '../art/sit-stand-walk';

export default function SizeCappedSample() {
  return (
    <Illustration
      title="Three people: one seated, one standing, one walking"
      caption={
        <Text size="xs" color="muted">
          A named step caps the width and the drawing fills it — sm is 24rem. Applied as min(token,
          100%), so the container can still overrule it.{' '}
          <Link href="https://www.openpeeps.com" target="_blank" rel="noreferrer">
            Open Peeps
          </Link>{' '}
          by Pablo Stanley (CC0).
        </Text>
      }
      size="sm"
    >
      <SitStandWalk />
    </Illustration>
  );
}
