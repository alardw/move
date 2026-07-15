import { MarkerList } from 'move';

// Ordered lists number via CSS counters. Per-level markers cascade the style:
// decimal → alpha → roman down the nesting.
export default function OrderedSample() {
  return (
    <MarkerList ordered markers={['decimal', 'alpha', 'roman']}>
      <MarkerList.Item>
        Analyze
        <MarkerList ordered>
          <MarkerList.Item>Survey the libraries</MarkerList.Item>
          <MarkerList.Item>Write the report</MarkerList.Item>
        </MarkerList>
      </MarkerList.Item>
      <MarkerList.Item>Spec the contract</MarkerList.Item>
      <MarkerList.Item>Generate &amp; validate</MarkerList.Item>
    </MarkerList>
  );
}
