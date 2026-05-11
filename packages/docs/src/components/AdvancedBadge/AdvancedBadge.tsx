import styles from './AdvancedBadge.module.css';

/**
 * Small badge marking a prop as advanced — most consumers won't need it.
 * Subtle styling so it doesn't distract from the common props.
 */
export function AdvancedBadge() {
  return (
    <span className={styles.badge} title="Advanced prop — most consumers won't need this">
      ADVANCED
    </span>
  );
}
