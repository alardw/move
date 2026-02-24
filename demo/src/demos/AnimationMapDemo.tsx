import { DocPage } from '../components/DocPage';

// =============================================================================
// Styles
// =============================================================================

const sectionStyle: React.CSSProperties = {
  marginTop: 'var(--move-spacing-xl)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-lg)',
  fontWeight: 600,
  color: 'var(--move-fg-base)',
  margin: '0 0 var(--move-spacing-sm) 0',
};

const proseStyle: React.CSSProperties = {
  fontSize: 'var(--move-size-sm)',
  lineHeight: 1.7,
  color: 'var(--move-fg-muted)',
  margin: '0 0 var(--move-spacing-md) 0',
  maxWidth: '65ch',
};

const monoStyle: React.CSSProperties = {
  fontFamily: "'SF Mono', monospace",
  fontSize: '0.8em',
  background: 'var(--move-bg-muted)',
  padding: '0.125rem 0.375rem',
  borderRadius: 'var(--move-rounded-sm)',
  color: 'var(--move-primary)',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'var(--move-size-sm)',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid var(--move-border-base)',
  background: 'var(--move-bg-subtle)',
  fontWeight: 600,
  color: 'var(--move-fg-muted)',
  fontSize: 'var(--move-size-xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid var(--move-border-base)',
  color: 'var(--move-fg-base)',
  verticalAlign: 'top',
  lineHeight: 1.5,
};

const tdMutedStyle: React.CSSProperties = {
  ...tdStyle,
  color: 'var(--move-fg-muted)',
  fontSize: 'var(--move-size-xs)',
};

const groupHeaderStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 600,
  color: 'var(--move-fg-subtle)',
  fontSize: 'var(--move-size-xs)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  background: 'var(--move-bg-muted)',
  padding: '0.5rem 1rem',
};

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.0625rem 0.375rem',
  borderRadius: 'var(--move-rounded-sm)',
  fontSize: '0.7rem',
  fontFamily: "'SF Mono', monospace",
  lineHeight: 1.6,
};

const cssTag: React.CSSProperties = {
  ...tagStyle,
  background: 'var(--move-info-subtle)',
  color: 'var(--move-info)',
};

const animeTag: React.CSSProperties = {
  ...tagStyle,
  background: 'var(--move-warning-subtle)',
  color: 'var(--move-warning)',
};

const keyframesTag: React.CSSProperties = {
  ...tagStyle,
  background: 'var(--move-success-subtle)',
  color: 'var(--move-success)',
};

const noneTag: React.CSSProperties = {
  ...tagStyle,
  background: 'var(--move-bg-muted)',
  color: 'var(--move-fg-subtle)',
};

// =============================================================================
// Data
// =============================================================================

interface ComponentAnimation {
  name: string;
  cssTransition: string;
  animeJs: string;
  cssKeyframes: string;
  animateProp: string;
}

const coreComponents: ComponentAnimation[] = [
  {
    name: 'Button',
    cssTransition: 'Hover colors, border, box-shadow',
    animeJs: 'Hover scale, press scale (via animate prop)',
    cssKeyframes: '—',
    animateProp: 'ElementAnimate',
  },
  {
    name: 'Alert',
    cssTransition: 'Close button hover',
    animeJs: 'Enter (translateY + opacity), exit (opacity)',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Avatar',
    cssTransition: '—',
    animeJs: 'Fallback reveal (opacity)',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Tooltip',
    cssTransition: '—',
    animeJs: 'Enter (scale + opacity, spring)',
    cssKeyframes: 'Exit fade (tooltip-out)',
    animateProp: 'LayerAnimate',
  },
  {
    name: 'Dropdown',
    cssTransition: '—',
    animeJs: 'Content enter/exit (scale + opacity), item stagger, item hover scale',
    cssKeyframes: '—',
    animateProp: 'PopupAnimate',
  },
  {
    name: 'Icon',
    cssTransition: '—',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Link',
    cssTransition: 'Color on hover',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
];

const formComponents: ComponentAnimation[] = [
  {
    name: 'Checkbox',
    cssTransition: 'Border/background on hover',
    animeJs: 'Check/uncheck (scale + opacity, spring), press scale',
    cssKeyframes: '—',
    animateProp: 'IndicatorAnimate',
  },
  {
    name: 'Switch',
    cssTransition: 'Background color',
    animeJs: 'Thumb translate (spring), press scale',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'RadioGroup',
    cssTransition: 'Border/background on hover',
    animeJs: 'Indicator check (scale + opacity, spring), press scale',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Select',
    cssTransition: '—',
    animeJs: 'Content enter/exit (scale + opacity), icon rotation, item stagger',
    cssKeyframes: '—',
    animateProp: 'PopupAnimate',
  },
  {
    name: 'InputText',
    cssTransition: 'Border color, box-shadow on focus',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Password',
    cssTransition: 'Border color, toggle icon color',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'Textarea',
    cssTransition: 'Border color, box-shadow on focus',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'InputRange',
    cssTransition: '—',
    animeJs: 'Thumb hover/press scale',
    cssKeyframes: '—',
    animateProp: 'ElementAnimate',
  },
  {
    name: 'DatePicker',
    cssTransition: '—',
    animeJs: 'Popup enter/exit (scale + opacity)',
    cssKeyframes: '—',
    animateProp: 'PopupAnimate',
  },
];

const overlayComponents: ComponentAnimation[] = [
  {
    name: 'Dialog',
    cssTransition: 'Close button hover',
    animeJs: '—',
    cssKeyframes: 'Overlay fade, content scale+translate (cubic-bezier spring)',
    animateProp: '—',
  },
  {
    name: 'Popover',
    cssTransition: 'Close button hover',
    animeJs: 'Content enter/exit (scale + opacity)',
    cssKeyframes: '—',
    animateProp: 'PopupAnimate',
  },
  {
    name: 'Toast',
    cssTransition: 'Action/close button hover',
    animeJs: 'Enter (height expand + slide), exit (slide + collapse), progress bar',
    cssKeyframes: '—',
    animateProp: 'LayerAnimate',
  },
];

const panelComponents: ComponentAnimation[] = [
  {
    name: 'Accordion',
    cssTransition: 'Trigger hover background',
    animeJs: 'Content height expand/collapse, opacity, icon rotation, item stagger',
    cssKeyframes: '—',
    animateProp: 'AccordionAnimateConfig',
  },
  {
    name: 'Collapsible',
    cssTransition: '—',
    animeJs: 'Content height expand/collapse, opacity, icon rotation',
    cssKeyframes: '—',
    animateProp: 'ContentAnimate',
  },
  {
    name: 'Tabs',
    cssTransition: 'Trigger color/border on hover',
    animeJs: 'Active indicator position + width (spring)',
    cssKeyframes: '—',
    animateProp: 'Animation (indicator)',
  },
  {
    name: 'Sidebar',
    cssTransition: 'Item hover background/color',
    animeJs: '—',
    cssKeyframes: '—',
    animateProp: '—',
  },
];

const toolbarComponents: ComponentAnimation[] = [
  {
    name: 'ToggleButton',
    cssTransition: '—',
    animeJs: 'Hover scale, press scale',
    cssKeyframes: '—',
    animateProp: 'ElementAnimate',
  },
];

const loadingComponents: ComponentAnimation[] = [
  {
    name: 'Spinner',
    cssTransition: '—',
    animeJs: '—',
    cssKeyframes: 'Rotate loop, dash loop',
    animateProp: '—',
  },
  {
    name: 'ProgressBar',
    cssTransition: '—',
    animeJs: 'Value change (translateX, spring)',
    cssKeyframes: 'Indeterminate loop',
    animateProp: '—',
  },
];

const calendarComponents: ComponentAnimation[] = [
  {
    name: 'Calendar',
    cssTransition: '—',
    animeJs: 'Month slide transitions, day stagger',
    cssKeyframes: '—',
    animateProp: '—',
  },
  {
    name: 'CalendarView',
    cssTransition: '—',
    animeJs: 'Month navigation slide',
    cssKeyframes: '—',
    animateProp: '—',
  },
];

// =============================================================================
// Render helpers
// =============================================================================

function Tag({ type, children }: { type: 'css' | 'anime' | 'keyframes' | 'none'; children: React.ReactNode }) {
  const styles = { css: cssTag, anime: animeTag, keyframes: keyframesTag, none: noneTag };
  return <span style={styles[type]}>{children}</span>;
}

function AnimationCell({ value, type }: { value: string; type: 'css' | 'anime' | 'keyframes' | 'none' }) {
  if (value === '—') return <td style={tdMutedStyle}>—</td>;
  return (
    <td style={tdMutedStyle}>
      <Tag type={type}>{type === 'css' ? 'css' : type === 'anime' ? 'anime.js' : type === 'keyframes' ? '@keyframes' : ''}</Tag>{' '}
      {value}
    </td>
  );
}

function ComponentRow({ row }: { row: ComponentAnimation }) {
  return (
    <tr>
      <td style={{ ...tdStyle, fontWeight: 500 }}>{row.name}</td>
      <AnimationCell value={row.cssTransition} type="css" />
      <AnimationCell value={row.animeJs} type="anime" />
      <AnimationCell value={row.cssKeyframes} type="keyframes" />
      <td style={tdMutedStyle}>
        {row.animateProp === '—' ? '—' : <code style={monoStyle}>{row.animateProp}</code>}
      </td>
    </tr>
  );
}

function GroupHeader({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={5} style={groupHeaderStyle}>{label}</td>
    </tr>
  );
}

// =============================================================================
// Demo
// =============================================================================

export function AnimationMapDemo() {
  return (
    <DocPage.Root>
      <DocPage.Header
        title="Component Map"
        description="Which animation technique each component uses, and the prop to customize it."
      />

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Animation Techniques by Component</h3>
        <p style={proseStyle}>
          Every component picks the right animation engine for the job.
          <Tag type="css">css</Tag> handles simple hover/focus state changes.
          <Tag type="anime">anime.js</Tag> handles orchestrated motion with spring physics.
          <Tag type="keyframes">@keyframes</Tag> handles looping or CSS-native sequences.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '12%' }}>Component</th>
                <th style={{ ...thStyle, width: '22%' }}>CSS Transition</th>
                <th style={{ ...thStyle, width: '28%' }}>anime.js</th>
                <th style={{ ...thStyle, width: '20%' }}>CSS @keyframes</th>
                <th style={{ ...thStyle, width: '18%' }}>animate prop</th>
              </tr>
            </thead>
            <tbody>
              <GroupHeader label="Core" />
              {coreComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Form" />
              {formComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Overlay" />
              {overlayComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Panel" />
              {panelComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Toolbar" />
              {toolbarComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Loading" />
              {loadingComponents.map(r => <ComponentRow key={r.name} row={r} />)}
              <GroupHeader label="Calendar" />
              {calendarComponents.map(r => <ComponentRow key={r.name} row={r} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animate prop types */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Animate Prop Types</h3>
        <p style={proseStyle}>
          Each component category accepts a different subset of animation states.
          The base <code style={monoStyle}>AnimateConfig</code> type has all possible states —
          component-specific types pick only what makes sense.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>States</th>
                <th style={thStyle}>Used by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}><code style={monoStyle}>ElementAnimate</code></td>
                <td style={tdMutedStyle}>enter, exit, hover, press</td>
                <td style={tdMutedStyle}>Button, ToggleButton, InputRange</td>
              </tr>
              <tr>
                <td style={tdStyle}><code style={monoStyle}>IndicatorAnimate</code></td>
                <td style={tdMutedStyle}>enter, exit, press, checked, unchecked</td>
                <td style={tdMutedStyle}>Checkbox</td>
              </tr>
              <tr>
                <td style={tdStyle}><code style={monoStyle}>ContentAnimate</code></td>
                <td style={tdMutedStyle}>enter, exit, open, close, stagger</td>
                <td style={tdMutedStyle}>Collapsible</td>
              </tr>
              <tr>
                <td style={tdStyle}><code style={monoStyle}>LayerAnimate</code></td>
                <td style={tdMutedStyle}>enter, exit</td>
                <td style={tdMutedStyle}>Tooltip, Toast</td>
              </tr>
              <tr>
                <td style={tdStyle}><code style={monoStyle}>PopupAnimate</code></td>
                <td style={tdMutedStyle}>enter, exit, stagger</td>
                <td style={tdMutedStyle}>Dropdown, Select, Popover, DatePicker</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DocPage.Root>
  );
}
