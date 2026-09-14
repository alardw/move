import { Illustration } from 'move';
import SitStandWalk from '../art/sit-stand-walk';

export default function CaptionSample() {
  return (
    <Illustration
      title="Three people: one seated, one standing, one walking"
      desc="A hand-drawn line illustration of three figures side by side — the first sitting cross-legged, the second standing with hands in pockets, the third mid-stride."
      caption="“Sit, stand, walk” from Open Peeps by Pablo Stanley (CC0). Ink and paper are the only two colours, so the whole drawing follows the theme."
      size="sm"
    >
      <SitStandWalk />
    </Illustration>
  );
}
