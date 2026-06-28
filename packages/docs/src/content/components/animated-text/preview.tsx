import { AnimatedText } from 'move';

/** Card-only preview for the components grid — a clean reveal, no controls. */
export default function AnimatedTextPreview() {
  return (
    <AnimatedText as="h2" by="character" effect="slideUp" trigger="inView">
      Animate your words
    </AnimatedText>
  );
}
