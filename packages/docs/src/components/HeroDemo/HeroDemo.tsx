import styles from './HeroDemo.module.css';

/** Bordered, padded container for the hero demo on each component page. */
export function HeroDemo({ children }: { children: React.ReactNode }) {
  return <div className={styles.root}>{children}</div>;
}
