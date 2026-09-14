import { useMemo, useState } from 'react';
import { Button, Icon, Illustration, Stack, Text, poppy, staggerItems } from 'move';
import type { AnimationTrigger } from 'move';

const LETTERS = ['L', 'O', 'G', 'O'];

export default function LogoSample() {
  const [play, setPlay] = useState(0);

  /**
   * A wordmark arriving a part at a time.
   *
   * The same feel a hand-rolled version reaches for — fade up, spring, a beat
   * between each part — with none of the machinery: no ref, no useEffect, no
   * run-once guard, no delay function, and no `opacity: 0` seeded onto every
   * shape. `from` is the seed and the stagger is the delay.
   *
   * Keyed on a counter with `deps`, so the mark sits still until you ask for
   * it and replays on every press.
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

      <Illustration title="The Logo wordmark" animations={wordmark} size="sm">
        <svg viewBox="0 0 300 96" width="300" height="96">
          <g className="illustration-pivot" data-move-stagger="">
            <rect className="illustration-accent" x="8" y="20" width="56" height="56" rx="14" />
            <circle className="illustration-accent-fg" cx="36" cy="48" r="13" />
          </g>
          {LETTERS.map((letter, i) => (
            <g key={letter + i} className="illustration-pivot" data-move-stagger="">
              {/* Centred in its own cell: anchored at the start, a narrow L
                  leaves a gap the round letters do not, and the word reads
                  unevenly. */}
              <text
                className="illustration-text"
                x={118 + i * 48}
                y="66"
                fontSize="48"
                fontWeight="700"
                textAnchor="middle"
                letterSpacing="0.02em"
              >
                {letter}
              </text>
            </g>
          ))}
        </svg>
      </Illustration>

      <Text size="sm" color="muted">
        Each part marks itself with `data-move-stagger`; the config never names one, so adding a
        letter needs no change to the animation.
      </Text>
    </Stack>
  );
}
