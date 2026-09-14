import { Illustration, Link, Text } from 'move';
import NatureOnScreen from '../art/nature-on-screen';

export default function SizeAutoSample() {
  return (
    <Illustration
      title="A person photographing a plant on a phone screen"
      desc="A large phone stands upright; a plant grows out of its screen and a figure beside it holds a camera up to the frame."
      caption={
        <Text size="xs" color="muted">
          The default. The drawing renders at the size it was drawn — 300px wide here — and scales
          down only when the parent is narrower. “Nature on screen” from{' '}
          <Link href="https://undraw.co/search/nature" target="_blank" rel="noreferrer">
            unDraw
          </Link>{' '}
          by Katerina Limpitsouni.
        </Text>
      }
    >
      <NatureOnScreen />
    </Illustration>
  );
}
