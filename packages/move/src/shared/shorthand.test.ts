import { describe, it, expect } from 'vitest';
import { directionalAttrs } from './shorthand';

describe('directionalAttrs', () => {
  it('renders a single data-{prop} for one token', () => {
    expect(directionalAttrs('padding', 'md')).toEqual({ 'data-padding': 'md' });
  });

  it('splits a "block inline" shorthand into -block / -inline', () => {
    expect(directionalAttrs('padding', 'md 2xl')).toEqual({
      'data-padding-block': 'md',
      'data-padding-inline': '2xl',
    });
  });

  it('tolerates extra whitespace between the two values', () => {
    expect(directionalAttrs('padding', '  md   2xl ')).toEqual({
      'data-padding-block': 'md',
      'data-padding-inline': '2xl',
    });
  });

  it('passes undefined through as an unset attribute', () => {
    expect(directionalAttrs('padding', undefined)).toEqual({ 'data-padding': undefined });
  });

  it('works for any prop name, not just padding', () => {
    expect(directionalAttrs('margin', 'sm lg')).toEqual({
      'data-margin-block': 'sm',
      'data-margin-inline': 'lg',
    });
  });
});
