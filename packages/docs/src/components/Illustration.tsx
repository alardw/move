import { useId } from 'react';
import styles from './Illustration.module.css';

export interface IllustrationProps {
  /** Required accessible label — becomes the SVG <title>. */
  title: string;
  /** Optional longer screen-reader description — becomes <desc>. */
  desc?: string;
  viewBox: string;
  /** Width variant — caps the rendered size. */
  width?: 'normal' | 'wide' | 'full';
  /** Custom max-width override (number → px, or any CSS length) — wins over `width`. */
  maxWidth?: number | string;
  /** Optional visible caption — rendered as a semantic <figure>/<figcaption>. */
  caption?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Illustration — the governed base for every docs SVG. It bakes in the things a
 * hand-rolled <svg> reliably gets wrong: an accessible label (role="img" + a
 * REQUIRED title, optional desc), the docs font token, responsive sizing, an
 * optional semantic <figcaption>, and a token-only palette — all via the CSS
 * module, never inline. Draw shapes as children; the laws are handled here.
 *
 * The wrapper holds the laws; the SVG content is your matter. Candidate for
 * promotion into Move once stable.
 */
export function Illustration({ title, desc, viewBox, width = 'wide', maxWidth, caption, className, style, children }: IllustrationProps) {
  const id = useId();
  const titleId = `${id}-t`;
  const descId = desc ? `${id}-d` : undefined;
  // Dynamic max-width travels as a CSS variable (the Move way), not inline `max-width`.
  const maxStyle: React.CSSProperties | undefined = maxWidth != null
    ? ({ '--il-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } as React.CSSProperties)
    : undefined;

  const svg = (
    <svg
      className={cx(styles.root, !caption && className)}
      data-width={caption ? undefined : width}
      role="img"
      aria-labelledby={descId ? `${titleId} ${descId}` : titleId}
      viewBox={viewBox}
      style={caption ? undefined : { ...maxStyle, ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      {desc && <desc id={descId}>{desc}</desc>}
      {children}
    </svg>
  );

  if (!caption) return svg;

  return (
    <figure className={cx(styles.figure, className)} data-width={width} style={{ ...maxStyle, ...style }}>
      {svg}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}

export default Illustration;
