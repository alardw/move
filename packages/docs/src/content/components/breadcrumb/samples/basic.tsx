import { Breadcrumb } from 'move';

export default function BasicSample() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Docs</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}
