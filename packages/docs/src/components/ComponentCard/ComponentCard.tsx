import { useEffect, useState, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Stack, Text, Badge, Icon, Deferred } from "move";
import type { ComponentContent } from "../../content/components/types";
import {
  PREVIEW_WIDTHS,
  type PreviewWidth,
} from "../../content/components/types";
import { TAXONOMY_BY_ID } from "../../content/components/taxonomies";
import styles from "./ComponentCard.module.css";

export interface ComponentCardProps {
  content: ComponentContent;
  /** Override the preview image (otherwise `meta.preview.image` is used). */
  image?: string;
}

/**
 * The tilted live preview. Split out and mounted lazily (via <Deferred>) so a
 * gallery of ~80 cards builds only the previews near the viewport, not all at
 * once — that synchronous mount storm is what starves neighbouring animations.
 * Because it only mounts when revealed, its flat-measure-then-tilt sequence runs
 * at reveal time, keeping JS-measured indicators (Tabs/Pagination/TOC) correct.
 */
function CardPreview({
  children,
  width,
  bare,
}: {
  children: ReactNode;
  width: PreviewWidth;
  bare?: boolean;
}) {
  // Render flat first, then tilt: the sliding indicators position via
  // getBoundingClientRect, which is wrong inside a CSS transform. Measure
  // untransformed, then apply the iso transform (which doesn't re-measure).
  const [tilted, setTilted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTilted(true), 150);
    return () => clearTimeout(t);
  }, []);

  const tiltClass = [
    styles.tilt,
    tilted && styles.tiltActive,
    width === "fit" && styles.tiltNarrow,
    bare && styles.tiltBare,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={tiltClass}
      style={
        width !== "fit" && width !== "full"
          ? { width: PREVIEW_WIDTHS[width] }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export function ComponentCard({ content, image }: ComponentCardProps) {
  const { meta, samples, preview: PreviewComponent } = content;
  const metaPreview = meta.preview ?? {};
  // Overlays declare preview behaviour in the spec (`preview.staged/bare/width`)
  // and ship a card-only `content.preview` render; everything else uses the
  // hand-authored docs `meta.preview`. Spec wins for bare/width.
  const specPreview = (content.spec?.preview ?? {}) as {
    staged?: boolean;
    bare?: boolean;
    width?: PreviewWidth;
  };
  const bare = specPreview.bare ?? metaPreview.bare;
  // Default to a contained width so every preview fits within the card boundary
  // (EmptyState's size); components opt into 'fit', a larger size, or 'full'.
  const width = specPreview.width ?? metaPreview.width ?? "sm";
  const cat = TAXONOMY_BY_ID[meta.categories?.[0] ?? ""];
  const category = cat?.label ?? "Component";
  const icon = cat?.icon ?? "box";
  // "Bring your own X": the component declares typed integration points (adapters).
  const hasIntegration =
    ((content.spec?.integrationPoints as unknown[] | undefined)?.length ?? 0) >
    0;
  const previewImage = image ?? metaPreview.image;
  const sample = metaPreview.sample
    ? samples?.find((s) => s.id === metaPreview.sample)
    : samples?.[0];
  const Sample = sample?.render;

  return (
    <div className={styles.card}>
      {/* The preview is decorative — hidden from a11y and non-interactive
          (pointer-events: none in CSS) so the card (a div with a stretched
          title link) never wraps the sample's own anchors. */}
      <div className={styles.frame} aria-hidden>
        {previewImage ? (
          <img src={previewImage} alt="" className={styles.image} />
        ) : PreviewComponent || Sample ? (
          // Live previews are the expensive part — mount them only near the
          // viewport. The frame's fixed height already reserves the space, so
          // there's no layout shift when the preview appears.
          <Deferred className={styles.deferred} rootMargin="300px">
            <CardPreview width={width} bare={bare}>
              {PreviewComponent ? (
                <PreviewComponent />
              ) : Sample ? (
                <Sample />
              ) : null}
            </CardPreview>
          </Deferred>
        ) : (
          <span className={styles.iconTile}>
            <Icon name={icon} size={24} />
          </span>
        )}
      </div>
      <Stack gap="xs" className={styles.body}>
        <Stack direction="row" gap="sm" align="center" justify="between">
          {/* Stretched link — the ::after covers the whole card. */}
          <RouterLink
            to={`/components/${meta.slug}`}
            className={styles.titleLink}
          >
            <Text weight="medium">{meta.name}</Text>
          </RouterLink>
          <Stack direction="row" gap="xs" align="center">
            {hasIntegration && (
              <Badge variant="soft" size="sm" color="blue">
                Integration
              </Badge>
            )}
            <Badge variant="soft" size="sm">
              {category}
            </Badge>
          </Stack>
        </Stack>
        <Text size="sm" color="muted">
          {meta.tagline}
        </Text>
      </Stack>
    </div>
  );
}
