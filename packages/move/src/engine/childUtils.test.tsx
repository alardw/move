import { describe, it, expect } from 'vitest';
import { containsElementOfType, elementTypeName } from './childUtils';

function Target() {
  return null;
}
function Other() {
  return null;
}
function Wrapper({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

describe('containsElementOfType', () => {
  it('finds a direct child', () => {
    expect(containsElementOfType(<Target />, Target)).toBe(true);
  });

  it('finds one among siblings', () => {
    expect(
      containsElementOfType(
        <>
          <Other />
          <Target />
        </>,
        Target,
      ),
    ).toBe(true);
  });

  it('finds one nested in plain markup', () => {
    expect(
      containsElementOfType(
        <div>
          <span>
            <Target />
          </span>
        </div>,
        Target,
      ),
    ).toBe(true);
  });

  it('returns false when absent', () => {
    expect(containsElementOfType(<Other />, Target)).toBe(false);
  });

  it('returns false for empty children', () => {
    expect(containsElementOfType(null, Target)).toBe(false);
    expect(containsElementOfType(undefined, Target)).toBe(false);
    expect(containsElementOfType('text', Target)).toBe(false);
  });

  it('stops at maxDepth', () => {
    const deep = (
      <div>
        <div>
          <div>
            <Target />
          </div>
        </div>
      </div>
    );
    expect(containsElementOfType(deep, Target, 3)).toBe(true);
    expect(containsElementOfType(deep, Target, 1)).toBe(false);
  });

  it('does not see through a consumer wrapper component', () => {
    // The wrapper's own children ARE part of the JSX the consumer wrote, so this
    // is found; a Target rendered by Wrapper's internals would not be.
    expect(
      containsElementOfType(
        <Wrapper>
          <Target />
        </Wrapper>,
        Target,
      ),
    ).toBe(true);
  });
});

describe('elementTypeName', () => {
  it('reads displayName', () => {
    (Target as React.FC).displayName = 'Target';
    expect(elementTypeName(<Target />)).toBe('Target');
  });

  it('falls back to _moveComponentName', () => {
    const Marked = () => null;
    (Marked as unknown as { _moveComponentName?: string })._moveComponentName = 'Marked';
    expect(elementTypeName(<Marked />)).toBe('Marked');
  });

  it('returns undefined for host elements and text', () => {
    expect(elementTypeName(<div />)).toBeUndefined();
    expect(elementTypeName('text')).toBeUndefined();
    expect(elementTypeName(null)).toBeUndefined();
  });

  it('returns undefined rather than throwing when the type does not exist', () => {
    // What a typo'd or never-exported sub-component looks like by the time a
    // parent walks its children. React reports it precisely once it renders;
    // reading through it here would throw first and bury that message.
    const Missing = undefined as unknown as React.FC;
    expect(() => elementTypeName(<Missing />)).not.toThrow();
    expect(elementTypeName(<Missing />)).toBeUndefined();
  });
});
