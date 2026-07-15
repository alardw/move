import { Link as RouterLink } from 'react-router-dom';
import { Stack, Heading, Text, Breadcrumb, Icon, Badge, Table, type Color } from 'move';
import { HighlightList, type HighlightItem, Section, TocRail, type TocItem } from '../../components';

type Support = 'supports' | 'enables' | 'partial' | 'none' | 'na' | 'consumer';

const SUPPORT: Record<Support, { label: string; color: Color }> = {
  supports: { label: 'Supports', color: 'green' },
  enables: { label: 'Enables', color: 'teal' },
  partial: { label: 'Partial', color: 'yellow' },
  none: { label: 'Does not', color: 'red' },
  na: { label: 'N/A', color: 'gray' },
  consumer: { label: 'Yours', color: 'blue' },
};

// Each cell is split into up to three labelled parts so the reader can scan
// who does what: what Move ships, what you must do, and where Move falls short.
interface CriterionNote {
  included?: string; // what Move ships / handles for you
  yours?: string; // what you must wire or supply
  gap?: string; // where Move's own support falls short
}

interface Criterion {
  sc: string;
  name: string;
  level: string;
  support: Support;
  note: CriterionNote;
}

// WCAG 2.2, Levels A + AA. Scored against the current library — honest, not aspirational.
// Support levels distinguish two things people often conflate:
//   "Supports" = Move handles it for you (no action needed beyond using the component).
//   "Enables"  = Move ships the full mechanism, but you must switch it on / supply content
//                (e.g. set invalid + add an error message). Not a Move deficiency.
//   "Partial"  = Move's own support is genuinely incomplete — a real gap on our side.
//   "Yours"    = entirely app-level; Move plays no part.
const PERCEIVABLE: Criterion[] = [
  { sc: '1.1.1', name: 'Non-text Content', level: 'A', support: 'consumer', note: { included: 'Icons default to aria-hidden; every component accepts aria-label.', yours: 'Alt text for images and meaningful icons.' } },
  { sc: '1.2.1–1.2.5', name: 'Time-based Media', level: 'A/AA', support: 'consumer', note: { included: 'AudioPlayer/VideoPlayer ship with controls.', yours: 'Captions, transcripts, and audio description (e.g. <track>).' } },
  { sc: '1.3.1', name: 'Info & Relationships', level: 'A', support: 'supports', note: { included: 'Radix roles; FormField wires label↔control (a real <label for>), aria-invalid, and aria-describedby; Checkbox/Radio self-name via aria-labelledby.' } },
  { sc: '1.3.2', name: 'Meaningful Sequence', level: 'A', support: 'supports', note: { included: 'Components render in logical DOM order; reading/tab order follows.', yours: 'Page-level sequence.' } },
  { sc: '1.3.3', name: 'Sensory Characteristics', level: 'A', support: 'consumer', note: { yours: 'Instructions that rely on shape/position are content-level.' } },
  { sc: '1.3.4', name: 'Orientation', level: 'AA', support: 'supports', note: { included: 'No component locks orientation.' } },
  { sc: '1.3.5', name: 'Identify Input Purpose', level: 'AA', support: 'supports', note: { included: 'Native inputs pass through autocomplete; PinInput sets one-time-code.' } },
  { sc: '1.4.1', name: 'Use of Color', level: 'A', support: 'enables', note: { included: 'Link defaults to an always-on underline (not color alone). The invalid state is a red border.', yours: 'Add a FormField.Description error (auto-associated) so the cue is not color-only.' } },
  { sc: '1.4.2', name: 'Audio Control', level: 'A', support: 'na', note: { included: 'Nothing auto-plays audio; players expose pause/stop.' } },
  { sc: '1.4.3', name: 'Contrast (Minimum)', level: 'AA', support: 'partial', note: { included: 'Themes from defineThemes are clamped to AA — guaranteed.', gap: 'The shipped lightTheme/darkTheme still carry failures (fg-subtle ≈ 2.57:1). Dogfood the generator or fix the exports.' } },
  { sc: '1.4.4', name: 'Resize Text', level: 'AA', support: 'supports', note: { included: 'Type scale is rem-based; no pixel-locked font sizes.' } },
  { sc: '1.4.5', name: 'Images of Text', level: 'AA', support: 'na', note: { included: 'Components render real text, never images of text.' } },
  { sc: '1.4.10', name: 'Reflow', level: 'AA', support: 'supports', note: { included: 'Container queries and min-width:0 layouts; no fixed-width traps.', yours: 'Spot-check Autocomplete tags at 200%.' } },
  { sc: '1.4.11', name: 'Non-text Contrast', level: 'AA', support: 'none', note: { gap: 'Input, checkbox, and switch borders resolve to gray-200 ≈ 1.24:1 (need 3:1). auditTheme now checks text and the focus ring at 3:1, but not resting borders. Highest-impact contrast fix.' } },
  { sc: '1.4.12', name: 'Text Spacing', level: 'AA', support: 'partial', note: { included: 'Mostly tolerant of spacing overrides.', gap: 'Single-line inputs use a fixed height that can clip enlarged line-height. Verify at 200%.' } },
  { sc: '1.4.13', name: 'Content on Hover or Focus', level: 'AA', support: 'supports', note: { included: 'Tooltip (Radix) is dismissible, hoverable, and persistent.' } },
];

const OPERABLE: Criterion[] = [
  { sc: '2.1.1', name: 'Keyboard', level: 'A', support: 'partial', note: { included: 'Radix overlays are fully operable.', gap: 'Carousel viewport has no arrow-key paging (buttons work); ColorPicker slider is role=slider with no key handler (use the channel inputs).' } },
  { sc: '2.1.2', name: 'No Keyboard Trap', level: 'A', support: 'supports', note: { included: 'No focus traps; Radix overlays release focus on close.' } },
  { sc: '2.1.4', name: 'Character Key Shortcuts', level: 'A', support: 'na', note: { included: 'No single-character shortcuts are imposed.' } },
  { sc: '2.2.1', name: 'Timing Adjustable', level: 'A', support: 'supports', note: { included: 'Toast auto-dismiss pauses on hover/focus and its duration is configurable (or disable-able).' } },
  { sc: '2.2.2', name: 'Pause, Stop, Hide', level: 'A', support: 'supports', note: { included: 'Reduced-motion is honored end to end: the JS engine snaps every animation to its end state, a global CSS reset neutralizes @keyframes/transitions (Skeleton pulse, Avatar pulse, PinInput blink), and Carousel autoplay does not start. Toast auto-dismiss also pauses on hover/focus.' } },
  { sc: '2.3.1', name: 'Three Flashes', level: 'A', support: 'supports', note: { included: 'No content flashes above threshold (PinInput caret blinks at 1 Hz).' } },
  { sc: '2.4.1', name: 'Bypass Blocks', level: 'A', support: 'consumer', note: { included: 'The shell composes landmarks.', yours: 'Place the skip link.' } },
  { sc: '2.4.2', name: 'Page Titled', level: 'A', support: 'consumer', note: { yours: 'Document <title>, set by your app/router.' } },
  { sc: '2.4.3', name: 'Focus Order', level: 'A', support: 'partial', note: { included: 'Focus order is generally logical.', gap: 'The mobile Sidebar sheet is a hand-rolled overlay with no focus trap/restore — focus escapes behind the backdrop.' } },
  { sc: '2.4.4', name: 'Link Purpose (In Context)', level: 'A', support: 'consumer', note: { included: 'Link renders a real anchor.', yours: 'The link text.' } },
  { sc: '2.4.5', name: 'Multiple Ways', level: 'AA', support: 'consumer', note: { yours: 'Site navigation strategy is app-level.' } },
  { sc: '2.4.6', name: 'Headings & Labels', level: 'AA', support: 'consumer', note: { included: 'Heading + Label components provide the structure.', yours: 'The descriptive text.' } },
  { sc: '2.4.7', name: 'Focus Visible', level: 'AA', support: 'supports', note: { included: 'The ring shows only for keyboard users (:focus-visible), from one --move-focus-ring token; its offset adapts to the element (hugs an input border, floats outside a button, insets on a table row). TimeField uses plain :focus — minor.' } },
  { sc: '2.4.11', name: 'Focus Not Obscured (Minimum)', level: 'AA', support: 'partial', note: { gap: 'New in 2.2. No scroll-padding is set, so sticky headers (Table, editor toolbar, Sidebar, Calendar) can cover an element tabbed underneath. Add scroll-margin/padding.' } },
  { sc: '2.5.1', name: 'Pointer Gestures', level: 'A', support: 'supports', note: { included: 'All interactions are single-pointer; no path or multipoint gestures required.' } },
  { sc: '2.5.2', name: 'Pointer Cancellation', level: 'A', support: 'partial', note: { included: 'Radix uses up-events.', gap: 'ColorPicker commits on pointer-down with no abort.' } },
  { sc: '2.5.3', name: 'Label in Name', level: 'A', support: 'supports', note: { included: 'Icon buttons name from labels; Checkbox/Radio visible text is the accessible name via aria-labelledby.' } },
  { sc: '2.5.4', name: 'Motion Actuation', level: 'A', support: 'na', note: { included: 'No device-motion actuation.' } },
  { sc: '2.5.7', name: 'Dragging Movements', level: 'AA', support: 'supports', note: { included: 'New in 2.2. Every draggable (Slider, ColorPicker, Carousel, Splitter, Drawer) has a tap/keyboard/button alternative.' } },
  { sc: '2.5.8', name: 'Target Size (Minimum)', level: 'AA', support: 'none', note: { gap: 'New in 2.2. 11 targets fall below 24×24 — ColorPicker sliders (10–18px) and NumberInput steppers (~15–18px) fail at default size; several controls fail at size sm.' } },
];

const UNDERSTANDABLE: Criterion[] = [
  { sc: '3.1.1', name: 'Language of Page', level: 'A', support: 'consumer', note: { yours: '<html lang>, set by your app.' } },
  { sc: '3.1.2', name: 'Language of Parts', level: 'AA', support: 'consumer', note: { yours: 'Marking foreign-language content is content-level.' } },
  { sc: '3.2.1', name: 'On Focus', level: 'A', support: 'supports', note: { included: 'No component changes context on focus.' } },
  { sc: '3.2.2', name: 'On Input', level: 'A', support: 'supports', note: { included: 'No component auto-submits or changes context on input.' } },
  { sc: '3.2.3', name: 'Consistent Navigation', level: 'AA', support: 'consumer', note: { yours: 'Navigation consistency is an app concern.' } },
  { sc: '3.2.4', name: 'Consistent Identification', level: 'AA', support: 'supports', note: { included: 'A given component is identified consistently across the library.' } },
  { sc: '3.2.6', name: 'Consistent Help', level: 'A', support: 'consumer', note: { yours: 'New in 2.2. A repeated help mechanism is app-level.' } },
  { sc: '3.3.1', name: 'Error Identification', level: 'A', support: 'enables', note: { included: 'aria-invalid on the control, plus the message auto-linked via aria-describedby and announced (role=alert).', yours: 'Set invalid and supply the message text.' } },
  { sc: '3.3.2', name: 'Labels or Instructions', level: 'A', support: 'supports', note: { included: 'Label associates via htmlFor (a real <label>); required reaches the control natively or via aria-required (incl. Checkbox). The asterisk is decorative (aria-hidden) — requiredness is programmatic.' } },
  { sc: '3.3.3', name: 'Error Suggestion', level: 'AA', support: 'enables', note: { included: 'FormField.Description error is auto-associated (aria-describedby) and announced, so suggestion text reaches the user.', yours: 'Write the wording of the suggestion.' } },
  { sc: '3.3.4', name: 'Error Prevention', level: 'AA', support: 'consumer', note: { yours: 'Confirm/undo for legal/financial submissions is app-flow.' } },
  { sc: '3.3.7', name: 'Redundant Entry', level: 'A', support: 'supports', note: { included: 'New in 2.2. Native inputs support autofill; PinInput enables OTP auto-entry.' } },
  { sc: '3.3.8', name: 'Accessible Authentication', level: 'AA', support: 'supports', note: { included: 'New in 2.2. No cognitive-test/CAPTCHA components; auth fields support autofill and one-time-code.' } },
];

const ROBUST: Criterion[] = [
  { sc: '4.1.2', name: 'Name, Role, Value', level: 'A', support: 'partial', note: { included: 'Radix supplies roles/states; names and aria-invalid are exposed across controls.', gap: 'Select uses menu (not combobox/listbox) semantics with no native form field, so its value is not a submittable named control out of the box.' } },
  { sc: '4.1.3', name: 'Status Messages', level: 'AA', support: 'partial', note: { included: 'Toast, Alert, Loader, Skeleton, Autocomplete, PasswordStrength announce correctly; FormField error messages announce via role=alert.', gap: 'Indeterminate ProgressBar sets no aria-busy.' } },
];

const GROUPS: { key: string; title: string; lede: string; rows: Criterion[] }[] = [
  { key: 'perceivable', title: '1. Perceivable', lede: 'Information and UI must be presentable in ways users can perceive.', rows: PERCEIVABLE },
  { key: 'operable', title: '2. Operable', lede: 'Interface components and navigation must be operable.', rows: OPERABLE },
  { key: 'understandable', title: '3. Understandable', lede: 'Information and operation must be understandable.', rows: UNDERSTANDABLE },
  { key: 'robust', title: '4. Robust', lede: 'Content must be robust enough for assistive technologies.', rows: ROBUST },
];

const GAPS: HighlightItem[] = [
  { icon: 'contrast', text: 'Non-text contrast fails for control borders (§1.4.11). Input/checkbox/switch borders sit near 1.24:1. auditTheme now clamps text and the focus ring to 3:1 but not resting borders. Fix: raise the border/placeholder tokens above 3:1 and extend auditTheme to UI borders. Highest leverage now that forms errors are wired.' },
  { icon: 'expand', text: 'Target sizes below 24px (§2.5.8). ColorPicker sliders and NumberInput steppers fail at default size. Fix: enlarge, or add expanded ::before hit areas (Autocomplete’s tag-remove is the pattern).' },
  { icon: 'panel-left', text: 'The mobile Sidebar sheet is a modal with no keyboard support (§2.1.2/§2.4.3). No focus trap, Escape, or restore. Fix: wrap it in Radix Dialog like Drawer already is.' },
];

const TOC: TocItem[] = [
  { href: '#stand', label: 'Where we stand' },
  { href: '#perceivable', label: '1. Perceivable' },
  { href: '#operable', label: '2. Operable' },
  { href: '#understandable', label: '3. Understandable' },
  { href: '#robust', label: '4. Robust' },
  { href: '#gaps', label: 'Known gaps' },
];

function SupportBadge({ support }: { support: Support }) {
  const s = SUPPORT[support];
  return <Badge variant="soft" color={s.color}>{s.label}</Badge>;
}

function CriteriaTable({ rows }: { rows: Criterion[] }) {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head>Criterion</Table.Head>
          <Table.Head>Level</Table.Head>
          <Table.Head>Support</Table.Head>
          <Table.Head>How Move addresses it</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rows.map((c) => (
          <Table.Row key={c.sc}>
            <Table.Cell>
              <Text weight="medium">{c.sc}</Text>
              <Text size="sm" color="muted">{c.name}</Text>
            </Table.Cell>
            <Table.Cell>{c.level}</Table.Cell>
            <Table.Cell><SupportBadge support={c.support} /></Table.Cell>
            <Table.Cell>
              <Stack gap="xs">
                {c.note.included && (
                  <Text size="sm">
                    <strong>Included:</strong> {c.note.included}
                  </Text>
                )}
                {c.note.yours && (
                  <Text size="sm">
                    <strong>Yours:</strong> {c.note.yours}
                  </Text>
                )}
                {c.note.gap && (
                  <Text size="sm" color="muted">
                    <strong>Gap:</strong> {c.note.gap}
                  </Text>
                )}
              </Stack>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

export function AccessibilityPage() {
  return (
    <Stack direction="row" gap="xl" align="stretch" id="accessibility">
      <Stack gap="xl" flex={1}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Breadcrumb.Link asChild>
              <RouterLink to="/">Docs</RouterLink>
            </Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Breadcrumb.Page>Accessibility</Breadcrumb.Page>
          </Breadcrumb.Item>
        </Breadcrumb>

        <Stack gap="sm">
          <Heading level={1}>Accessibility</Heading>
          <Text color="muted" size="lg">
            An honest conformance report for WCAG 2.2, Levels A and AA — every criterion, how Move
            addresses it, and where it falls short. No blanket “compliant” claims: a component
            library can only take you part of the way.
          </Text>
          <Stack direction="row" gap="xs" wrap>
            <Badge variant="soft" color="green"><Icon name="check" />Strong keyboard + focus foundation</Badge>
            <Badge variant="soft" color="yellow"><Icon name="triangle-alert" />Known contrast + target-size gaps</Badge>
            <Badge variant="soft"><Icon name="git-commit-horizontal" />WCAG 2.2 A + AA</Badge>
          </Stack>
        </Stack>

        <Section id="stand" title="Where we stand" lede="What we guarantee, what we own, and what is yours to finish.">
          <Stack gap="md">
            <Text>
              The one thing Move <strong>guarantees</strong> is color contrast for themes built with{' '}
              <RouterLink to="/customize/theme">defineThemes</RouterLink> — every generated color is
              clamped to WCAG 2.2 AA. Everything else sits on a spectrum.
            </Text>
            <Text color="muted">
              Move <strong>owns</strong> the things a library can: keyboard and focus behavior (most
              overlays are built on Radix), a consistent focus-visible ring, single-pointer
              alternatives for every drag, and status-message roles on feedback components. Move{' '}
              <strong>enables</strong> a second tier — labels, autocomplete, and error
              association (aria-invalid + announced messages, now wired for you when you set{' '}
              <code>invalid</code> and add an error Description). And a large group is simply{' '}
              <strong>yours</strong>: alt text,
              heading structure, page language, meaningful sequence, and the words in your error
              messages. The table below says which is which for all 53 criteria.
            </Text>
            <Stack direction="row" gap="md" wrap>
              <Text size="sm" color="muted"><SupportBadge support="supports" /> Move handles it</Text>
              <Text size="sm" color="muted"><SupportBadge support="enables" /> mechanism ready, you wire it</Text>
              <Text size="sm" color="muted"><SupportBadge support="partial" /> incomplete on our side</Text>
              <Text size="sm" color="muted"><SupportBadge support="none" /> not yet</Text>
              <Text size="sm" color="muted"><SupportBadge support="consumer" /> your responsibility</Text>
              <Text size="sm" color="muted"><SupportBadge support="na" /> not applicable</Text>
            </Stack>
          </Stack>
        </Section>

        {GROUPS.map((g) => (
          <Section key={g.key} id={g.key} title={g.title} lede={g.lede}>
            <CriteriaTable rows={g.rows} />
          </Section>
        ))}

        <Section id="gaps" title="Known gaps & fixes" lede="The failures worth fixing first, most-leverage down. We publish these rather than paper over them.">
          <HighlightList items={GAPS} />
        </Section>
      </Stack>
      <TocRail items={TOC} />
    </Stack>
  );
}
