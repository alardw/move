import { Accordion } from 'move';

export function AccordionDemo() {
  return (
    <div className="demo-section">
      <h3>Basic Accordion</h3>
      <div className="demo-box">
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              Yes. It adheres to the WAI-ARIA design pattern. All keyboard interactions are supported, including arrow keys for navigation between items, Enter or Space to toggle, and proper focus management. Screen readers can correctly announce the expanded/collapsed state of each item.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-2">
            <Accordion.Header>
              <Accordion.Trigger>Is it unstyled?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              Yes. It's unstyled by default, giving you freedom over the look and feel. You can customize every aspect including colors, typography, spacing, borders, and animations. The component provides semantic HTML structure while leaving visual design entirely up to you.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-3">
            <Accordion.Header>
              <Accordion.Trigger>Can it be animated?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              Yes! This accordion uses anime.js spring physics for smooth, natural animations. The content height animates with a stiff spring for quick response, while the chevron icon rotates with a gentler spring. You can customize the spring parameters (mass, stiffness, damping, velocity) to achieve different feels.
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="item-4">
            <Accordion.Header>
              <Accordion.Trigger>What about performance?</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              The accordion is optimized for performance. Animations use hardware-accelerated transforms where possible. The content is force-mounted but hidden with height: 0, avoiding layout thrashing during open/close. MutationObserver efficiently detects state changes without polling or re-renders.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
