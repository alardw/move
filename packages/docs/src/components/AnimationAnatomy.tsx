import { Illustration } from './Illustration';

/**
 * AnimationAnatomy — the "anatomy of an animation" diagram. Built on
 * <Illustration>, so the a11y label, the font token, responsive sizing and the
 * token palette come from the governed base; this file is just the shapes.
 * Nested boxes mirror how a motion config nests: trigger ▸ sequence ▸ target ▸
 * animation. Inside the animation, WHAT (the dimension) and FEEL (the spring)
 * are siblings — labelled per line, not nested.
 */

interface AnimationAnatomyProps {
  className?: string;
  style?: React.CSSProperties;
}

interface Layer {
  name: string;
  /** a leaf question (WHEN/WHERE) — caps tag; empty for containers */
  question: string;
  /** Sequence + Animation are containers, not questions */
  container?: boolean;
  meaning: string;
  /** [x, y, w, h] of the layer box */
  box: [number, number, number, number];
  /** code lines rendered in the chip; `label` tags a line (e.g. WHAT / FEEL) */
  code: { key: string; rest: string; label?: string }[];
}

const LAYERS: Layer[] = [
  { name: 'Trigger',   question: 'WHEN',  meaning: 'fires on an event — mount, state change, press', box: [24, 92, 592, 620], code: [{ key: 'trigger:', rest: " 'Content.enter'" }] },
  { name: 'Sequence',  question: '', container: true, meaning: 'orders the steps — chain, delay or stagger', box: [64, 224, 512, 472], code: [{ key: 'sequence:', rest: ' [ … ]' }] },
  { name: 'Target',    question: 'WHERE', meaning: 'the named slot that responds',                  box: [104, 356, 432, 324], code: [{ key: 'target:', rest: " 'Content'" }] },
  { name: 'Animation', question: '', container: true, meaning: 'bundles what + feel',               box: [144, 488, 352, 176], code: [{ key: 'scale:', rest: ' { from: 0.9, to: 1 }', label: 'WHAT' }, { key: 'ease:', rest: ' poppy', label: 'FEEL' }] },
];

export function AnimationAnatomy({ className, style }: AnimationAnatomyProps) {
  return (
    <Illustration
      title="Anatomy of an animation"
      desc="A motion config as four nested layers. Trigger answers WHEN — it fires on an event: trigger: 'Content.enter'. Inside it a Sequence container orders the steps. Inside that, Target answers WHERE — the slot that responds: target: 'Content'. Inside that, an Animation container bundles WHAT and FEEL: scale from 0.9 to 1 (what), eased with poppy (feel)."
      viewBox="0 76 640 652"
      width="wide"
      caption="How an animation config nests — read outside-in."
      className={className}
      style={style}
    >
      <style>{`
        .aa-hdr  { fill: var(--move-primary); }
        .aa-name { fill: var(--move-primary-fg); font-weight: 600; font-size: 17px; }
        .aa-mean { fill: var(--move-primary-fg); font-weight: 400; font-size: 12px; }
        .aa-q    { fill: var(--move-primary-fg); font-weight: 600; font-size: 12px; letter-spacing: 1.4px; }
        .aa-cont { fill: var(--move-primary-fg); font-weight: 400; font-size: 11px; letter-spacing: .8px; }
        .aa-chip { fill: var(--move-bg-base); }
        .aa-code { font: 400 13.5px var(--move-font-code, ui-monospace, monospace); fill: var(--move-fg-base); }
        .aa-key  { fill: var(--move-fg-base); font-weight: 600; }
        .aa-line { fill: var(--move-fg-base); font-weight: 600; font-size: 10px; letter-spacing: 1.2px; }
      `}</style>

      {LAYERS.map((ly, i) => {
        const [x, y, w, h] = ly.box;
        const hx = x + 16;
        const hy = y + 16;
        const hw = w - 32;
        const twoLine = ly.code.length > 1;
        const chipY = hy + 46 + 12;
        const chipH = twoLine ? 72 : 40;
        return (
          <g key={ly.name}>
            {/* nested surfaces deepen inward so the nesting reads without an outline */}
            <rect className="il-surface" fillOpacity={0.06 + i * 0.05} x={x} y={y} width={w} height={h} rx={20} />
            <rect className="aa-hdr" x={hx} y={hy} width={hw} height={46} rx={12} />
            <text className="aa-name" x={hx + 16} y={hy + 22}>{ly.name}</text>
            <text className="aa-mean" x={hx + 16} y={hy + 38}>{ly.meaning}</text>
            {ly.container
              ? <text className="aa-cont" x={hx + hw - 16} y={hy + 29} textAnchor="end">container</text>
              : ly.question
                ? <text className="aa-q" x={hx + hw - 16} y={hy + 29} textAnchor="end">{ly.question}</text>
                : null}
            <rect className="aa-chip" x={hx} y={chipY} width={hw} height={chipH} rx={10} />
            {ly.code.map((line, li) => {
              const yy = chipY + 26 + li * 24;
              return (
                <g key={li}>
                  <text className="aa-code" x={hx + 16} y={yy}>
                    <tspan className="aa-key">{line.key}</tspan>
                    <tspan>{line.rest}</tspan>
                  </text>
                  {line.label && <text className="aa-line" x={hx + hw - 16} y={yy} textAnchor="end">{line.label}</text>}
                </g>
              );
            })}
          </g>
        );
      })}
    </Illustration>
  );
}

export default AnimationAnatomy;
