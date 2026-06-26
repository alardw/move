import { useEffect, useRef, useState } from 'react';
import { Text, moveAnimate, type JSAnimation } from 'move';
import styles from './LogoMark.module.css';

const SWAP_INTERVAL_MS = 10000;
const SWAP_DURATION = 550;

/**
 * Logo wordmark that reads "Move UI" and periodically morphs the middle
 * character between `U` and `A`, mimicking anime.js splitText chars
 * reveal — the outgoing glyph rises and fades out while the incoming
 * glyph slides up from below.
 */
export function LogoMark() {
  const [letter, setLetter] = useState<'U' | 'A'>('U');
  const uRef = useRef<HTMLSpanElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const uAnimRef = useRef<JSAnimation | null>(null);
  const aAnimRef = useRef<JSAnimation | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setLetter((l) => (l === 'U' ? 'A' : 'U'));
    }, SWAP_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const u = uRef.current;
    const a = aRef.current;
    if (!u || !a) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      u.style.opacity = '1';
      u.style.transform = 'translateY(0)';
      a.style.opacity = '0';
      a.style.transform = 'translateY(100%)';
      return;
    }

    const incoming = letter === 'U' ? u : a;
    const outgoing = letter === 'U' ? a : u;
    const incomingRef = letter === 'U' ? uAnimRef : aAnimRef;
    const outgoingRef = letter === 'U' ? aAnimRef : uAnimRef;

    moveAnimate(
      incoming,
      {
        translateY: { from: '100%', to: '0%', ease: 'outQuart', duration: SWAP_DURATION },
        opacity: { from: 0, to: 1, ease: 'outQuart', duration: SWAP_DURATION },
      },
      incomingRef,
    );
    moveAnimate(
      outgoing,
      {
        translateY: { from: '0%', to: '-100%', ease: 'outQuart', duration: SWAP_DURATION },
        opacity: { from: 1, to: 0, ease: 'outQuart', duration: SWAP_DURATION },
      },
      outgoingRef,
    );
  }, [letter]);

  return (
    <Text as="span" className={styles.root}>
      <span>Move</span>
      <span className={styles.suffix} aria-label={`Move ${letter}I`}>
        <span className={styles.slot} aria-hidden="true">
          <span ref={uRef} className={styles.char}>U</span>
          <span ref={aRef} className={`${styles.char} ${styles.charA}`}>A</span>
        </span>
        <span>I</span>
      </span>
    </Text>
  );
}
