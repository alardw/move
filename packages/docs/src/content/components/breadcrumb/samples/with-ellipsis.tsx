import { Breadcrumb } from 'move';

/**
 * Long trails fold the middle into an `Ellipsis` so the trail stays
 * within the page header. The ellipsis is a focusable, keyboard-
 * accessible element by default.
 */
export default function WithEllipsisSample() {
  return (
    <Breadcrumb>
      <Breadcrumb.Item><Breadcrumb.Link href="/">Acme</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Item><Breadcrumb.Link href="/projects">Projects</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Ellipsis />
      <Breadcrumb.Item><Breadcrumb.Link href="/sprint-7">Sprint 7</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Item><Breadcrumb.Page>Stand-up notes</Breadcrumb.Page></Breadcrumb.Item>
    </Breadcrumb>
  );
}
