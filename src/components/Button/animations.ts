import { animate, spring } from 'animejs';

export type ButtonAnimation = 'none' | 'spring';

// Spring presets matching animejs.com/easing-editor
const springs = {
  quick: { mass: 0.6, stiffness: 600, damping: 18, velocity: 0 },
};

export const animationDown: Record<Exclude<ButtonAnimation, 'none'>, (el: HTMLElement) => void> = {
  spring: (el) => {
    animate(el, {
      scale: 0.97,
      ease: spring(springs.quick),
    });
  },
};

export const animationUp: Record<Exclude<ButtonAnimation, 'none'>, (el: HTMLElement) => void> = {
  spring: (el) => {
    animate(el, {
      scale: 1,
      ease: spring(springs.quick),
    });
  },
};

export const animationReset = (el: HTMLElement) => {
  el.style.backgroundColor = '';
  animate(el, {
    scale: 1,
    ease: spring(springs.quick),
  });
};
