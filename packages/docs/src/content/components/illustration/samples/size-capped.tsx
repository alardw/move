import { Illustration } from 'move';
import SitStandWalk from '../art/sit-stand-walk';

export default function SizeCappedSample() {
  return (
    <Illustration
      title="Three people: one seated, one standing, one walking"
      caption="A named step caps the width and the drawing fills it — sm is 24rem. Applied as min(token, 100%), so the container can still overrule it. Open Peeps by Pablo Stanley (CC0)."
      size="sm"
    >
      <SitStandWalk />
    </Illustration>
  );
}
