import { Illustration } from 'move';
import NatureOnScreen from '../art/nature-on-screen';

export default function SizeAutoSample() {
  return (
    <Illustration
      title="A person photographing a plant on a phone screen"
      desc="A large phone stands upright; a plant grows out of its screen and a figure beside it holds a camera up to the frame."
      caption="The default. The drawing renders at the size it was drawn — 300px wide here — and scales down only when the parent is narrower. “Nature on screen” from unDraw by Katerina Limpitsouni."
    >
      <NatureOnScreen />
    </Illustration>
  );
}
