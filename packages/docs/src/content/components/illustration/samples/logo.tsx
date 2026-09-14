import { useMemo, useState } from 'react';
import { Button, Icon, Illustration, Stack, poppy, staggerItems } from 'move';
import type { AnimationTrigger } from 'move';

/**
 * The wordmark's own letters, at their own advances.
 *
 * A fixed pitch would space them evenly and read wrong — M is half again as
 * wide as o, and the logo is tracked at -0.02em. These x positions are the real
 * ones for the theme font at this size, so the word looks like the word and
 * each letter can still be animated on its own.
 */
const LETTERS = [
  { ch: 'M', x: 8 },
  { ch: 'o', x: 47.6 },
  { ch: 'v', x: 76.4 },
  { ch: 'e', x: 102.3 },
];

export default function LogoSample() {
  const [play, setPlay] = useState(0);

  /**
   * The same feel a hand-rolled version reaches for — fade up, spring, a beat
   * between each part — with none of the machinery: no ref, no useEffect, no
   * run-once guard, no delay function, and no `opacity: 0` seeded onto every
   * shape. `from` is the seed and the stagger is the delay.
   *
   * Keyed on a counter with `deps`, so the mark sits still until you ask for it
   * and replays on every press.
   */
  const wordmark: AnimationTrigger[] = useMemo(
    () => [
      {
        trigger: 'wordmark',
        deps: [play],
        sequence: [
          {
            target: 'Root',
            children: '[data-move-stagger]',
            stagger: staggerItems.stagger,
            animation: {
              opacity: { from: 0, to: 1, duration: 600, ease: 'outQuart' },
              translateY: { from: 40, to: 0, ease: poppy },
            },
          },
        ],
      },
    ],
    [play],
  );

  return (
    <Stack gap="md" align="start">
      <Button size="sm" variant="primary" onClick={() => setPlay((n) => n + 1)}>
        <Icon name="play" /> Play
      </Button>

      <Illustration
        title="The Move wordmark"
        caption="Each part marks itself with data-move-stagger; the config never names one, so adding a letter needs no change to the animation."
        animations={wordmark}
        size="sm"
      >
        <svg viewBox="0 0 140 96" width="140" height="96">
          {LETTERS.map(({ ch, x }) => (
            <g key={ch + x} className="illustration-pivot" data-move-stagger="">
              <text
                className="illustration-text"
                x={x}
                y="65"
                fontSize="48"
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                {ch}
              </text>
            </g>
          ))}
        </svg>
      </Illustration>
    </Stack>
  );
}
