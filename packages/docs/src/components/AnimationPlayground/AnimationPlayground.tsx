import { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Text,
  Button,
  InputRange,
  Grid,
  Tabs,
  Card,
  springs,
  easings,
  type SpringParams,
} from 'move';
import { animate, spring } from 'animejs';
import styles from './AnimationPlayground.module.css';

const SPRING_ENTRIES = Object.entries(springs) as [string, SpringParams][];

// Curve plot, drawn like a standard easing graph (cubic-bezier.com / easings.net):
// a square with the unit box framed — x is time (0→1), y is value (0→1), running
// bottom-left to top-right. The margin leaves room for overshoot to read outside
// the box. SVG y grows downward, so value 0 sits at the bottom.
const PLOT = 240;
const MARGIN = 44;
const INNER = PLOT - MARGIN * 2;
const xOf = (t: number) => MARGIN + t * INNER;
const yOf = (v: number) => PLOT - MARGIN - v * INNER;

/**
 * Live preview: three demo objects (position, rotation, scale) loop with the
 * given ease — a named easing string, or a spring built from raw params.
 * Remount via a `key` to restart cleanly when the ease or duration changes.
 */
function Preview({
  ease,
  duration,
  isSpring,
}: {
  ease: string | SpringParams;
  duration: number;
  isSpring: boolean;
}) {
  const posRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tracerRef = useRef<SVGCircleElement>(null);
  const [curve, setCurve] = useState('');

  useEffect(() => {
    const pos = posRef.current;
    const rot = rotRef.current;
    const scale = scaleRef.current;
    const track = trackRef.current;
    if (!pos || !rot || !scale || !track) return;

    const distance = (track.offsetWidth - 40) * 0.9;
    const easeVal = isSpring ? spring(ease as SpringParams) : (ease as string);
    const dur = isSpring ? undefined : duration;
    const common = { ease: easeVal, duration: dur, loop: true };

    const anims = [
      animate(pos, { translateX: [0, distance], ...common } as Parameters<typeof animate>[1]),
      animate(rot, { rotate: [0, 180], ...common } as Parameters<typeof animate>[1]),
      animate(scale, { scale: [1, 1.6], ...common } as Parameters<typeof animate>[1]),
    ];

    // Sample the ease over its own duration to draw the curve, then run a
    // tracer that moves linearly in x (time) and follows the ease in y.
    const proxy = { v: 0 };
    const sampler = animate(proxy, { v: [0, 1], ease: easeVal, duration: dur } as Parameters<typeof animate>[1]);
    sampler.pause();
    const D = (sampler as unknown as { duration: number }).duration || (dur ?? 800);
    let d = '';
    const N = 80;
    for (let i = 0; i <= N; i++) {
      sampler.seek((D * i) / N);
      d += `${i === 0 ? 'M' : 'L'}${xOf(i / N).toFixed(1)} ${yOf(proxy.v).toFixed(1)} `;
    }
    sampler.revert();
    setCurve(d);

    const tracer = tracerRef.current;
    const tracerAnims = tracer
      ? [
          animate(tracer, { cx: [xOf(0), xOf(1)], ease: 'linear', duration: D, loop: true } as Parameters<typeof animate>[1]),
          animate(tracer, { cy: [yOf(0), yOf(1)], ease: easeVal, duration: dur, loop: true } as Parameters<typeof animate>[1]),
        ]
      : [];

    return () => {
      anims.forEach((a) => a.revert());
      tracerAnims.forEach((a) => a.revert());
    };
  }, [ease, duration, isSpring]);

  return (
    <Stack direction="row" gap="lg" align="stretch" wrap>
      <Card.Root className={styles.fill}>
        <Card.Body>
          <Stack gap="lg">
            <Stack direction="row" align="center" gap="md">
              <Text size="sm" color="muted" className={styles.rowLabel}>Position</Text>
              <div ref={trackRef} className={styles.track}>
                <div ref={posRef} className={styles.dot} />
              </div>
            </Stack>
            <Stack direction="row" align="center" gap="md">
              <Text size="sm" color="muted" className={styles.rowLabel}>Rotation</Text>
              <Stack direction="row" align="center" justify="center" className={styles.stage}>
                <div ref={rotRef} className={styles.square} />
              </Stack>
            </Stack>
            <Stack direction="row" align="center" gap="md">
              <Text size="sm" color="muted" className={styles.rowLabel}>Scale</Text>
              <Stack direction="row" align="center" justify="center" className={styles.stage}>
                <div ref={scaleRef} className={styles.dot} style={{ position: 'static' }} />
              </Stack>
            </Stack>
          </Stack>
        </Card.Body>
      </Card.Root>

      <Card.Root>
        <Card.Body>
          <Stack gap="xs" align="center">
            <Text size="sm" color="muted">Curve</Text>
            <div className={styles.plot}>
              <svg viewBox={`0 0 ${PLOT} ${PLOT}`} preserveAspectRatio="xMidYMid meet" className={styles.svg}>
                <rect x={MARGIN} y={MARGIN} width={INNER} height={INNER} className={styles.box} />
                <text className={styles.axis} x={MARGIN - 8} y={PLOT - MARGIN + 4} textAnchor="end">0</text>
                <text className={styles.axis} x={MARGIN - 8} y={MARGIN + 4} textAnchor="end">1</text>
                <text className={styles.axis} x={PLOT - MARGIN} y={PLOT - MARGIN + 18} textAnchor="middle">1</text>
                <text className={styles.axisTitle} x={MARGIN + INNER / 2} y={PLOT - 8} textAnchor="middle">Time</text>
                <text
                  className={styles.axisTitle}
                  x={14}
                  y={PLOT / 2}
                  textAnchor="middle"
                  transform={`rotate(-90 14 ${PLOT / 2})`}
                >
                  Value
                </text>
                <path d={curve} className={styles.curve} />
                <circle ref={tracerRef} r="5" cx={xOf(0)} cy={yOf(0)} className={styles.tracer} />
              </svg>
            </div>
          </Stack>
        </Card.Body>
      </Card.Root>
    </Stack>
  );
}

function EasingsTab() {
  const [easing, setEasing] = useState('outQuart');
  const [duration, setDuration] = useState(1000);

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Duration (ms)</Text>
        <InputRange min={200} max={3000} step={100} value={duration} onValueChange={(v: number[]) => setDuration(v[0])} showValue />
      </Stack>

      <Grid minChildWidth="116px" gap="xs">
        {easings.map((e) => (
          <Button
            key={e}
            size="sm"
            variant={easing === e ? 'primary' : 'secondary'}
            onClick={() => setEasing(e)}
          >
            {e}
          </Button>
        ))}
      </Grid>

      <Preview key={`${easing}-${duration}`} ease={easing} duration={duration} isSpring={false} />
    </Stack>
  );
}

function SpringsTab() {
  const [active, setActive] = useState(SPRING_ENTRIES[0][0]);
  const [params, setParams] = useState<SpringParams>(SPRING_ENTRIES[0][1]);

  const selectPreset = (name: string, p: SpringParams) => {
    setActive(name);
    setParams(p);
  };
  const update = (key: keyof SpringParams, value: number) => {
    setActive('');
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" weight="medium">Presets</Text>
        <Stack direction="row" gap="xs" wrap>
          {SPRING_ENTRIES.map(([name, p]) => (
            <Button
              key={name}
              size="sm"
              variant={active === name ? 'primary' : 'secondary'}
              onClick={() => selectPreset(name, p)}
            >
              {name}
            </Button>
          ))}
        </Stack>
      </Stack>

      <Stack gap="xs">
        <Text size="sm" weight="medium">Custom parameters</Text>
        <Grid minChildWidth="200px" gap="lg">
          <Stack gap="xs">
            <Text size="sm" color="muted">Mass</Text>
            <InputRange min={0.1} max={10} step={0.1} value={params.mass} onValueChange={(v: number[]) => update('mass', v[0])} showValue />
          </Stack>
          <Stack gap="xs">
            <Text size="sm" color="muted">Stiffness</Text>
            <InputRange min={10} max={1000} step={10} value={params.stiffness} onValueChange={(v: number[]) => update('stiffness', v[0])} showValue />
          </Stack>
          <Stack gap="xs">
            <Text size="sm" color="muted">Damping</Text>
            <InputRange min={1} max={100} step={1} value={params.damping} onValueChange={(v: number[]) => update('damping', v[0])} showValue />
          </Stack>
          <Stack gap="xs">
            <Text size="sm" color="muted">Velocity</Text>
            <InputRange min={0} max={10} step={0.5} value={params.velocity} onValueChange={(v: number[]) => update('velocity', v[0])} showValue />
          </Stack>
        </Grid>
      </Stack>

      <Preview key={JSON.stringify(params)} ease={params} duration={1000} isSpring />
    </Stack>
  );
}

/**
 * Interactive springs + easings visualizer — pick a named spring or easing
 * (or dial in custom spring physics) and watch three objects move with it.
 * Recovered and rebuilt from the old demo app entirely on Move components.
 */
export function AnimationPlayground() {
  return (
    <Tabs.Root defaultValue="springs">
      <Tabs.List>
        <Tabs.Trigger value="springs">Springs</Tabs.Trigger>
        <Tabs.Trigger value="easings">Easings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="springs">
        <Stack padding="lg">
          <SpringsTab />
        </Stack>
      </Tabs.Content>
      <Tabs.Content value="easings">
        <Stack padding="lg">
          <EasingsTab />
        </Stack>
      </Tabs.Content>
    </Tabs.Root>
  );
}
