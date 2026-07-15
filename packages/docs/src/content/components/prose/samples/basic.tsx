import { Prose } from 'move';

export default function BasicSample() {
  return (
    <Prose>
      {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
      <h2>Why Move?</h2>
      {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
      <p>
        Move is a small, opinionated React component library — buttons, inputs, modals, the usual scaffolding —
        built on Radix primitives where they exist and from scratch where they don’t.
      </p>
      {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
      <h3>What you get</h3>
      {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
      <ul>
        {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
        <li>~60 components with consistent props, animations, and accessibility</li>
        {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
        <li>A token system that themes the whole library from a single map</li>
        {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
        <li>An animation system you can opt out of per-instance, per-trigger, or globally</li>
      </ul>
      {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
      <p>
        {/* composite-purity-ignore: Prose styles raw HTML — that's its entire purpose */}
        Drop in <code>{'<MoveRoot>'}</code> at the root of your app and you’re done.
      </p>
    </Prose>
  );
}
