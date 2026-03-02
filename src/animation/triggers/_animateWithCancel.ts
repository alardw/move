import { animate, type JSAnimation } from 'animejs';

const activeAnimations = new WeakMap<HTMLElement, JSAnimation>();

export function animateWithCancel(el: HTMLElement, props: Parameters<typeof animate>[1]): JSAnimation {
  const existing = activeAnimations.get(el);
  if (existing) existing.pause();
  const anim = animate(el, props);
  activeAnimations.set(el, anim);
  return anim;
}
