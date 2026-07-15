import { MarkerList } from 'move';

// An Icon (by name) as the marker — set once on the list, overridable per item.
export default function IconsSample() {
  return (
    <MarkerList icon="check">
      <MarkerList.Item>Typechecks against the schema</MarkerList.Item>
      <MarkerList.Item>Tests pass</MarkerList.Item>
      <MarkerList.Item icon="x">Skip: not yet wired up</MarkerList.Item>
    </MarkerList>
  );
}
