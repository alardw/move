import { MarkerList } from 'move';

// One `markers` array on the root — every nested level inherits it and picks the
// marker for its own depth (disc → circle → square).
export default function NestedSample() {
  return (
    <MarkerList markers={['disc', 'circle', 'square']}>
      <MarkerList.Item>
        Collections &amp; data
        <MarkerList>
          <MarkerList.Item>ItemGallery</MarkerList.Item>
          <MarkerList.Item>
            DataTable
            <MarkerList>
              <MarkerList.Item>Filter</MarkerList.Item>
              <MarkerList.Item>Sort</MarkerList.Item>
            </MarkerList>
          </MarkerList.Item>
        </MarkerList>
      </MarkerList.Item>
      <MarkerList.Item>
        Forms &amp; flows
        <MarkerList>
          <MarkerList.Item>AuthForm</MarkerList.Item>
          <MarkerList.Item>Wizard</MarkerList.Item>
        </MarkerList>
      </MarkerList.Item>
    </MarkerList>
  );
}
