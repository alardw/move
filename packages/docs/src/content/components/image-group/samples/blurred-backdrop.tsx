import { ImageGroup } from 'move';

// Recipe: when a thumbnail is shorter or narrower than the cell, plain
// object-fit: contain leaves dead bands of background. The fix used by
// Apple Music / YouTube / Spotify is to lay a scaled-up + blurred copy
// of the same image behind it — the "letterboxing" colour matches the
// image automatically, no per-image work needed.
//
// Each cell stacks two <img>s:
//   • a backdrop (filter: blur + object-fit: cover) that paints the cell
//   • the original, centered at its natural fit on top
//
// Wrapped here in a tiny local component so the recipe stays a copy-paste.
function FilledImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4 / 3',
        borderRadius: 'var(--move-rounded-md)',
        overflow: 'hidden',
      }}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(20px) saturate(1.2)',
          transform: 'scale(1.15)',
        }}
      />
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

// Mixed aspect ratios — some images will be letterboxed inside the
// 4:3 cell. Backdrop fills the dead space with a colour-matched blur.
const photos = [
  { id: 1015, w: 400, h: 240 },
  { id: 1018, w: 220, h: 320 },
  { id: 1025, w: 400, h: 200 },
  { id: 1043, w: 300, h: 300 },
  { id: 1059, w: 200, h: 300 },
  { id: 1062, w: 400, h: 260 },
];

export default function BlurredBackdropSample() {
  return (
    <ImageGroup cols={3} gap="md">
      {photos.map((p) => (
        <FilledImage
          key={p.id}
          src={`https://picsum.photos/id/${p.id}/${p.w}/${p.h}`}
          alt=""
        />
      ))}
    </ImageGroup>
  );
}
