import { useLayoutEffect, useRef } from 'react';
import { useResolvedIcon } from 'move';
// Reuse the REAL toast stylesheet so the replica is styled identically and
// tracks any CSS change automatically. Toast can't be staged like the other
// overlays (singleton store + viewport portals to document.body), so this is a
// hand-built static replica of one ToastItem — kept honest by a drift test
// (preview.test.tsx) that diffs it against a really-rendered toast.
import styles from '../../../../../move/src/components/feedback/Toast/Toast.module.css';

/** Card-only preview: a static, inert replica of a success toast. */
export default function ToastPreview() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) ref.current.inert = true;
  }, []);

  const icon = useResolvedIcon('circle-check', 18);
  const closeIcon = useResolvedIcon('x', 14);

  return (
    <div ref={ref}>
      <div className={styles.itemWrapper}>
        <div
          className={styles.item}
          data-variant="success"
          data-position="bottom-right"
          role="status"
          aria-live="polite"
        >
          <span className={styles.icon} data-variant="success">{icon}</span>
          <div className={styles.content}>
            <div className={styles.message}>Saved — your changes are live.</div>
          </div>
          <button className={styles.closeButton} aria-label="Close notification">
            {closeIcon}
          </button>
          <div className={styles.progressBar} style={{ visibility: 'visible' }} />
        </div>
      </div>
    </div>
  );
}
