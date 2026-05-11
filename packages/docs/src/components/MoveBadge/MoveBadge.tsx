import styles from './MoveBadge.module.css';

/**
 * Small badge marking a prop as Move-specific (i.e. not available on the
 * underlying Radix / HTML primitive).
 */
export function MoveBadge() {
  return (
    <span className={styles.badge} title="Move-specific prop (not in the underlying primitive)">
      MOVE
    </span>
  );
}
