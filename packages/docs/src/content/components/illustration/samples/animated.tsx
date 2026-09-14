import { useState } from 'react';
import { Button, Icon, Illustration, Stack, Text, poppy, quick, staggerItems } from 'move';
import type { AnimationTrigger } from 'move';

/**
 * One trigger, three steps. The backdrop opens, the sheets lift out of the box
 * in turn, and the badge lands on top.
 */
const unpack: AnimationTrigger[] = [
  {
    trigger: 'Root.enter',
    sequence: [
      {
        children: '[data-backdrop]',
        stagger: staggerItems.stagger,
        animation: {
          scale: { from: 0.6, to: 1, ease: poppy },
          opacity: { from: 0, to: 1, duration: 260 },
        },
      },
      {
        children: '[data-move-stagger]',
        stagger: staggerItems.stagger,
        animation: {
          translateY: { from: 26, to: 0, ease: poppy },
          rotate: { from: 0, to: 1, ease: quick },
          opacity: { from: 0, to: 1, duration: 240 },
        },
      },
      {
        children: '[data-badge]',
        stagger: staggerItems.stagger,
        animation: { scale: { from: 0, to: 1, ease: poppy } },
      },
    ],
  },
];

export default function AnimatedSample() {
  // Bumping the key remounts the illustration, so the enter replays.
  const [play, setPlay] = useState(0);

  return (
    <Stack gap="md" align="start">
      <Button size="sm" variant="primary" onClick={() => setPlay((n) => n + 1)}>
        <Icon name="play" /> Replay
      </Button>

      <Illustration
        key={play}
        title="Three documents lifting out of an open box, one marked done"
        animations={unpack}
        size="sm"
      >
        <svg viewBox="0 0 300 200" width="300" height="200">
          {/* The soft blob behind the scene */}
          <circle
            className="illustration-accent-subtle illustration-pivot"
            data-backdrop=""
            cx="150"
            cy="104"
            r="82"
          />

          {/* Three sheets, lifting out in turn */}
          <g className="illustration-pivot" data-move-stagger="">
            <rect className="illustration-panel" x="86" y="34" width="60" height="76" rx="5" />
            <rect className="illustration-text-muted" x="96" y="48" width="34" height="5" rx="2" />
            <rect className="illustration-text-muted" x="96" y="60" width="40" height="5" rx="2" />
            <rect className="illustration-text-muted" x="96" y="72" width="26" height="5" rx="2" />
          </g>
          <g className="illustration-pivot" data-move-stagger="">
            <rect
              className="illustration-panel-raised"
              x="122"
              y="22"
              width="60"
              height="76"
              rx="5"
            />
            <rect className="illustration-text-muted" x="132" y="36" width="40" height="5" rx="2" />
            <rect className="illustration-text-muted" x="132" y="48" width="30" height="5" rx="2" />
            <rect className="illustration-text-muted" x="132" y="60" width="36" height="5" rx="2" />
          </g>
          <g className="illustration-pivot" data-move-stagger="">
            <rect className="illustration-accent" x="158" y="34" width="60" height="76" rx="5" />
            <rect className="illustration-accent-fg" x="168" y="48" width="36" height="5" rx="2" />
            <rect className="illustration-accent-fg" x="168" y="60" width="28" height="5" rx="2" />
          </g>

          {/* The open box */}
          <path
            className="illustration-panel-raised"
            d="M58 116h184l-14 62a8 8 0 0 1-8 6H80a8 8 0 0 1-8-6z"
          />
          <rect className="illustration-panel" x="50" y="104" width="200" height="24" rx="6" />
          <path className="illustration-line" d="M50 116h200" />

          {/* The badge */}
          <g className="illustration-pivot" data-badge="">
            <circle className="illustration-success" cx="228" cy="62" r="17" />
            <path
              className="illustration-line-strong"
              d="M220 62l6 6 12-13"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </Illustration>

      <Text size="sm" color="muted">
        The shapes mark themselves with `data-move-stagger`; the config never names one.
      </Text>
    </Stack>
  );
}
