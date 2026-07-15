import { MarkerList } from 'move';

export default function BasicSample() {
  return (
    <MarkerList>
      <MarkerList.Item>Analyze how existing libraries build the component</MarkerList.Item>
      <MarkerList.Item>Write the typed spec — the approved contract</MarkerList.Item>
      <MarkerList.Item>Generate the source, tests, and docs from it</MarkerList.Item>
      <MarkerList.Item>Validate against the contract</MarkerList.Item>
    </MarkerList>
  );
}
