import { Prose } from 'move';

export default function BasicSample() {
  return (
    <Prose>
      <h2>Why Move?</h2>
      <p>
        Move is a small, opinionated React component library — buttons, inputs, modals, the usual scaffolding —
        built on Radix primitives where they exist and from scratch where they don’t.
      </p>
      <h3>What you get</h3>
      <ul>
        <li>~60 components with consistent props, animations, and accessibility</li>
        <li>A token system that themes the whole library from a single map</li>
        <li>An animation system you can opt out of per-instance, per-trigger, or globally</li>
      </ul>
      <p>
        Drop in <code>{'<MoveRoot>'}</code> at the root of your app and you’re done.
      </p>
    </Prose>
  );
}
