/**
 * Directional spacing shorthand — one principle behind every Move spacing prop.
 *
 * A prop typed `Shorthand<Token>` accepts either a single token or a two-value
 * `"block inline"` string, the way CSS reads two-value shorthand:
 *
 *     padding="md"        // all sides md
 *     padding="md 2xl"    // top/bottom md, left/right 2xl
 *
 * `directionalAttrs` turns that value into the data-attributes the global
 * spacing utilities style from (`styles/utilities.css`):
 *
 *     {...directionalAttrs('padding', props.padding)}
 *       → single: data-padding="md"
 *       → shorthand: data-padding-block="md" data-padding-inline="2xl"
 *
 * So a component adds the shorthand with no inline style and no per-component
 * parsing: type the prop `Shorthand<Token>` and spread the helper. The same two
 * lines work for any box-spacing prop (padding today; margin/inset when needed
 * add their global utilities the same way).
 */

/** A single token, or a two-value `"block inline"` shorthand (like CSS). */
export type Shorthand<T extends string> = T | `${T} ${T}`;

/**
 * Data-attributes for a directional spacing prop. A single token → `data-{prop}`;
 * a `"block inline"` value → `data-{prop}-block` + `data-{prop}-inline`.
 * Spread the result onto the element; the global utilities do the styling.
 */
export function directionalAttrs(prop: string, value?: string): Record<string, string | undefined> {
  const parts = value?.trim().split(/\s+/) ?? [];
  if (parts.length === 2) {
    return { [`data-${prop}-block`]: parts[0], [`data-${prop}-inline`]: parts[1] };
  }
  return { [`data-${prop}`]: value };
}
