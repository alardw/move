import { Illustration } from 'move';

export default function CaptionSample() {
  return (
    <Illustration
      title="Three cards fanned out, the front one picked"
      desc="A stack of three rounded cards spread left to right, the nearest one filled in the accent colour with two lines of text on it."
      caption="One picked out of a set — the accent is the only colour the drawing names."
      size="sm"
    >
      <svg viewBox="0 0 300 190" width="300" height="190">
        <circle className="illustration-accent-subtle" cx="150" cy="98" r="84" />

        <g className="illustration-pivot">
          <rect className="illustration-panel" x="36" y="52" width="92" height="116" rx="10" />
          <rect className="illustration-text-muted" x="50" y="70" width="48" height="7" rx="3" />
          <rect className="illustration-text-muted" x="50" y="86" width="62" height="7" rx="3" />
        </g>

        <rect
          className="illustration-panel-raised"
          x="104"
          y="40"
          width="92"
          height="116"
          rx="10"
        />
        <rect className="illustration-text-muted" x="118" y="58" width="54" height="7" rx="3" />
        <rect className="illustration-text-muted" x="118" y="74" width="40" height="7" rx="3" />

        <rect className="illustration-accent" x="172" y="52" width="92" height="116" rx="10" />
        <rect className="illustration-accent-fg" x="186" y="70" width="58" height="7" rx="3" />
        <rect className="illustration-accent-fg" x="186" y="86" width="44" height="7" rx="3" />
        <circle className="illustration-accent-fg" cx="218" cy="128" r="14" />
        <path
          className="illustration-line-accent"
          d="M211 128l5 5 10-11"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </Illustration>
  );
}
