import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Code, Breadcrumb } from 'move';
import { DOCS_NAV } from '../nav';

/**
 * Temporary page used for every route until real content is authored.
 */
export function Placeholder() {
  const { pathname } = useLocation();

  const section = DOCS_NAV.find((s) => s.items.some((i) => i.to === pathname));
  const item = section?.items.find((i) => i.to === pathname);

  return (
    <Stack gap="lg">
      {section && (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to={section.items[0].to}>{section.label}</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          {item && item.to !== section.items[0].to && (
            <Breadcrumb.Item>
              <Breadcrumb.Page>{item.label}</Breadcrumb.Page>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      )}
      <Stack gap="xs">
        <Heading level={1}>{item?.label ?? 'Docs'}</Heading>
        <Text color="muted" size="lg">
          Placeholder page for <Code>{pathname}</Code>. Replace with real content.
        </Text>
      </Stack>
    </Stack>
  );
}
