import { Illustration } from 'move';
import PeepStanding from '../art/peep-standing';

export default function SizeAutoSample() {
  return (
    <Illustration
      title="A person standing, hands in pockets"
      desc="A hand-drawn line illustration of a figure standing square to the viewer, arms folded, hair tied back."
      caption="The default. The drawing renders at the size it was drawn — 170px wide here — and scales down only when the parent is narrower. Open Peeps by Pablo Stanley (CC0)."
    >
      <PeepStanding />
    </Illustration>
  );
}
