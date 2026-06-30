import { Illustration } from './Illustration';

/**
 * LifecycleIllustration — the three moments a component animates: Enter (on
 * mount), Respond (while mounted), Exit (on unmount). Built on <Illustration>,
 * so a11y, font and tokens are handled; this file is just the shapes. Keep the
 * text minimal here — the prose lives below it on the page.
 */

interface LifecycleIllustrationProps {
  className?: string;
  style?: React.CSSProperties;
}

const PHASES = [
  { name: 'Enter', keyword: 'on mount' },
  { name: 'Respond', keyword: 'on state' },
  { name: 'Exit', keyword: 'on unmount' },
] as const;

const CARD_W = 200;
const GAP = 36;
const X0 = 24;
const CARD_Y = 30;
const CARD_H = 240;
const GLYPH_CY = CARD_Y + 150; // shared centre line for glyphs + flow chevrons
const cardX = (i: number) => X0 + i * (CARD_W + GAP);

function Frame({ cx, cy, opacity, scale }: { cx: number; cy: number; opacity: number; scale: number }) {
  const w = 68 * scale;
  const h = 28 * scale;
  return <rect className="il-accent" x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={7} opacity={opacity} />;
}

function Glyph({ phase, cx, cy }: { phase: string; cx: number; cy: number }) {
  if (phase === 'Respond') {
    // a switch reacting to state
    return (
      <g>
        <rect className="li-track" x={cx - 32} y={cy - 13} width={64} height={26} rx={13} />
        <circle className="il-accent" cx={cx - 15} cy={cy} r={8} opacity={0.2} />
        <circle className="il-accent" cx={cx + 15} cy={cy} r={9} />
      </g>
    );
  }
  // Motion frames. The solid element is centre-stage (same spot for both phases —
  // enter's settled position is exit's starting position). The trail scales + fades:
  // Enter grows in from below, Exit dissolves out above. Solid drawn last (on top).
  const dir = phase === 'Enter' ? 1 : -1;
  const frames = [
    { dy: dir * 36, o: 0.2, s: 0.78 },
    { dy: dir * 18, o: 0.48, s: 0.9 },
    { dy: 0, o: 1, s: 1 },
  ];
  return <g>{frames.map((f, i) => <Frame key={i} cx={cx} cy={cy + f.dy} opacity={f.o} scale={f.s} />)}</g>;
}

export function LifecycleIllustration({ className, style }: LifecycleIllustrationProps) {
  return (
    <Illustration
      title="The lifecycle of an animation"
      desc="Three moments a component animates. Enter, on mount — it transitions in rather than appearing. Respond, while mounted — it reacts to state, like a switch sliding its thumb. Exit, on unmount — it animates out before React removes it."
      viewBox="0 0 720 300"
      caption="The three moments a component animates — enter, respond, exit."
      className={className}
      style={style}
    >
      <style>{`
        .li-name  { fill: var(--move-fg-base); font-weight: 600; font-size: 16px; }
        .li-key   { fill: var(--move-fg-muted); font-weight: 300; font-size: 11px; }
        .li-track { fill: none; stroke: var(--move-fg-muted); stroke-width: 2; }
        .li-flow  { fill: none; stroke: var(--move-fg-muted); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
      `}</style>

      {PHASES.map((p, i) => {
        const x = cardX(i);
        const cx = x + CARD_W / 2;
        const hy = CARD_Y + 14;
        return (
          <g key={p.name}>
            <rect className="il-surface" fillOpacity={0.08} x={x} y={CARD_Y} width={CARD_W} height={CARD_H} rx={18} />
            <text className="li-name" x={cx} y={hy + 20} textAnchor="middle">{p.name}</text>
            <text className="li-key" x={cx} y={hy + 34} textAnchor="middle">{p.keyword}</text>
            <Glyph phase={p.name} cx={cx} cy={GLYPH_CY} />
          </g>
        );
      })}

      {/* lifecycle flow between phases */}
      {[0, 1].map((i) => {
        const ax = cardX(i) + CARD_W + GAP / 2;
        const ay = GLYPH_CY;
        return <path key={i} className="li-flow" d={`M ${ax - 5} ${ay - 7} l 7 7 l -7 7`} />;
      })}
    </Illustration>
  );
}

export default LifecycleIllustration;
