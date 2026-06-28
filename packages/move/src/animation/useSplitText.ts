'use client';
import * as React from 'react';
import { animate, stagger, splitText } from 'animejs';
import type { JSAnimation } from 'animejs';
import { prefersReducedMotion } from './utils/helpers';
import { poppy } from './easings';

/**
 * useSplitText — Tier-2 `textSplit` animation primitive.
 *
 * Splits a text node into a runtime-generated set of character / word / line
 * elements (anime.js `splitText`) and staggers their entrance. The declarative
 * `useAnimations` trigger system animates fixed named slots, so it can't express
 * this data-dependent node set — that's why this lives as its own primitive.
 *
 * Accessibility: splits with `accessible: true`, so anime.js injects a
 * visually-hidden copy of the full string and marks every generated visible
 * segment aria-hidden — screen readers read the sentence once, not
 * segment-by-segment.
 *
 * Reduced motion: when `prefers-reduced-motion: reduce`, the text is never
 * split or animated — it renders immediately in its final state.
 */

export type SplitTextBy = 'character' | 'word' | 'line';
export type SplitTextEffect = 'fade' | 'slideUp' | 'blurUp' | 'scale';
export type SplitTextTrigger = 'mount' | 'inView' | 'hover';

export interface UseSplitTextOptions {
  /** The text being animated. Changing it reverts the old split and re-runs. */
  text: string;
  /** Split granularity. */
  by?: SplitTextBy;
  /** Per-segment entrance effect. */
  effect?: SplitTextEffect;
  /** When the reveal runs. */
  trigger?: SplitTextTrigger;
  /** For inView/hover, only animate the first time. */
  once?: boolean;
  /** ms between segments. `null` → sensible per-`by` default. */
  stagger?: number | null;
  /** ms before the first segment animates. */
  delay?: number;
  /** ms duration of each segment animation. */
  duration?: number;
}

export interface UseSplitTextReturn {
  /** Attach to the text container element. */
  ref: React.RefObject<HTMLElement | null>;
  /** True once the reveal has completed (or immediately under reduced motion). */
  animated: boolean;
}

/** Default per-segment stagger (ms) by granularity. */
const DEFAULT_STAGGER: Record<SplitTextBy, number> = {
  character: 30,
  word: 60,
  line: 120,
};

/** Maps `by` to the splitText param key and the resulting segment array. */
const SEGMENT_KEY: Record<SplitTextBy, 'chars' | 'words' | 'lines'> = {
  character: 'chars',
  word: 'words',
  line: 'lines',
};

/**
 * Per-effect tween. `from` is also written to the segment inline-style up front
 * so there's no first-frame flash before the animation starts.
 */
function effectParams(effect: SplitTextEffect): {
  from: Record<string, string>;
  to: Record<string, unknown>;
} {
  switch (effect) {
    case 'slideUp':
      return {
        from: { opacity: '0', transform: 'translateY(0.5em)' },
        to: { opacity: [0, 1], translateY: ['0.5em', '0em'], ease: 'outQuart' },
      };
    case 'blurUp':
      return {
        from: { opacity: '0', transform: 'translateY(0.3em)', filter: 'blur(8px)' },
        to: {
          opacity: [0, 1],
          translateY: ['0.3em', '0em'],
          filter: ['blur(8px)', 'blur(0px)'],
          ease: 'outQuart',
        },
      };
    case 'scale':
      return {
        from: { opacity: '0', transform: 'scale(0.6)' },
        to: { opacity: [0, 1], scale: [0.6, 1], ease: poppy },
      };
    case 'fade':
    default:
      return {
        from: { opacity: '0' },
        to: { opacity: [0, 1], ease: 'outQuart' },
      };
  }
}

export function useSplitText(options: UseSplitTextOptions): UseSplitTextReturn {
  const {
    text,
    by = 'word',
    effect = 'fade',
    trigger = 'inView',
    once = true,
    stagger: staggerMs = null,
    delay = 0,
    duration = 600,
  } = options;

  const ref = React.useRef<HTMLElement | null>(null);
  const [animated, setAnimated] = React.useState(false);

  // Latest option values, read inside imperative callbacks without re-binding
  // observers/listeners on every render.
  const latest = React.useRef({ by, effect, once, staggerMs, delay, duration, trigger });
  latest.current = { by, effect, once, staggerMs, delay, duration, trigger };

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: never split or animate — show the final text immediately.
    if (prefersReducedMotion()) {
      setAnimated(true);
      return;
    }

    setAnimated(false);

    const opts = latest.current;
    const segKey = SEGMENT_KEY[opts.by];
    const { from, to } = effectParams(opts.effect);

    // splitText mutates the DOM and reads browser APIs (document.fonts, layout).
    // If it throws in an unsupported environment, degrade to plain visible text.
    let splitter: ReturnType<typeof splitText>;
    try {
      // In character mode also create word wrappers: bare char spans have no
      // break opportunities between them, so a long line won't wrap and
      // overflows its container. Word wrappers restore normal line breaking.
      const params =
        opts.by === 'character'
          ? { words: true, chars: true, accessible: true }
          : { [segKey]: true, accessible: true };
      splitter = splitText(el, params);
    } catch {
      setAnimated(true);
      return;
    }
    const segments = (splitter[segKey] as HTMLElement[]) ?? [];

    // Seed the hidden start state synchronously to avoid a first-frame flash.
    for (const seg of segments) {
      Object.assign(seg.style, from);
    }

    let current: JSAnimation | undefined;
    let observer: IntersectionObserver | undefined;
    let done = false;

    const run = () => {
      if (done && opts.once) return;
      const stepDelay = opts.staggerMs ?? DEFAULT_STAGGER[opts.by];
      current = animate(segments, {
        ...to,
        duration: opts.duration,
        delay: stagger(stepDelay, { start: opts.delay }),
        onComplete: () => {
          done = true;
          setAnimated(true);
        },
      } as Parameters<typeof animate>[1]);
    };

    // Snap segments back to their hidden start state so the reveal can replay.
    const reset = () => {
      current?.pause();
      for (const seg of segments) Object.assign(seg.style, from);
      setAnimated(false);
    };

    const onHover = () => {
      run();
      if (opts.once) el.removeEventListener('mouseenter', onHover);
    };
    const onLeave = () => reset();

    if (opts.trigger === 'mount') {
      run();
    } else if (opts.trigger === 'hover') {
      // Reveal on hover; hide again on leave (unless once) so it can replay.
      el.addEventListener('mouseenter', onHover);
      if (!opts.once) el.addEventListener('mouseleave', onLeave);
    } else {
      // inView
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              run();
              if (opts.once) observer?.disconnect();
            }
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(el);
    }

    return () => {
      current?.pause();
      observer?.disconnect();
      el.removeEventListener('mouseenter', onHover);
      el.removeEventListener('mouseleave', onLeave);
      splitter.revert();
    };
    // Re-split / re-animate when the text or any split-shaping option changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, by, effect, trigger]);

  return { ref, animated };
}
