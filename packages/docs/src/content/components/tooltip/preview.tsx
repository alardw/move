import { Button, Icon, Tooltip } from 'move';
import { StagedOverlay } from '../../../components';

/**
 * Card-only preview: the tooltip staged open and inert. Tooltips are the odd
 * one out — no `modal`, no interact-outside dismissal — so this uses the
 * compound API directly and only takes the stage `container` from the helper.
 * `inert` keeps it from closing on blur/leave; the trigger is the anchor.
 */
export default function TooltipPreview() {
  return (
    <StagedOverlay minHeight={160}>
      {({ container }) => (
        <Tooltip.Root open onOpenChange={() => {}} delayDuration={0}>
          <Tooltip.Trigger asChild>
            <Button variant="secondary">
              <Icon name="save" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content container={container} sideOffset={8}>
            Save (Cmd+S)
          </Tooltip.Content>
        </Tooltip.Root>
      )}
    </StagedOverlay>
  );
}
