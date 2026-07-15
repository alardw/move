// Generated from Prose.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Prose } from './Prose';

describe('Prose', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders as div element', () => {
      render(<Prose data-testid="prose">Content</Prose>);
      const el = screen.getByTestId('prose');
      expect(el.tagName).toBe('DIV');
    });

    it('renders children content', () => {
      render(<Prose>Hello world</Prose>);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<Prose ref={ref}>Content</Prose>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <Prose className="custom" style={{ marginTop: '10px' }} data-testid="prose">
          Content
        </Prose>,
      );
      const el = screen.getByTestId('prose');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });

    it('spreads HTML attributes', () => {
      render(
        <Prose data-testid="prose" aria-label="prose-section">
          Content
        </Prose>,
      );
      expect(screen.getByTestId('prose')).toHaveAttribute('aria-label', 'prose-section');
    });
  });

  // === Size ===
  describe('size', () => {
    it('defaults to size=base', () => {
      render(<Prose data-testid="prose">Content</Prose>);
      expect(screen.getByTestId('prose')).toHaveAttribute('data-size', 'base');
    });

    it.each(['sm', 'base', 'lg'] as const)('supports size=%s', (size) => {
      render(
        <Prose size={size} data-testid="prose">
          Content
        </Prose>,
      );
      expect(screen.getByTestId('prose')).toHaveAttribute('data-size', size);
    });
  });

  // === Child element styling ===
  describe('child element styling', () => {
    it('styles heading elements (h1-h6)', () => {
      render(
        <Prose data-testid="prose">
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
        </Prose>,
      );
      expect(screen.getByText('Heading 1').tagName).toBe('H1');
      expect(screen.getByText('Heading 2').tagName).toBe('H2');
      expect(screen.getByText('Heading 3').tagName).toBe('H3');
      expect(screen.getByText('Heading 4').tagName).toBe('H4');
      expect(screen.getByText('Heading 5').tagName).toBe('H5');
      expect(screen.getByText('Heading 6').tagName).toBe('H6');
    });

    it('styles paragraph elements', () => {
      render(
        <Prose data-testid="prose">
          <p>A paragraph</p>
        </Prose>,
      );
      expect(screen.getByText('A paragraph').tagName).toBe('P');
    });

    it('styles anchor elements', () => {
      render(
        <Prose data-testid="prose">
          <a href="#">A link</a>
        </Prose>,
      );
      const link = screen.getByText('A link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '#');
    });

    it('styles unordered and ordered lists', () => {
      render(
        <Prose data-testid="prose">
          <ul>
            <li>Unordered item</li>
          </ul>
          <ol>
            <li>Ordered item</li>
          </ol>
        </Prose>,
      );
      expect(screen.getByText('Unordered item').tagName).toBe('LI');
      expect(screen.getByText('Ordered item').tagName).toBe('LI');
    });

    it('styles blockquote', () => {
      render(
        <Prose data-testid="prose">
          <blockquote>A quote</blockquote>
        </Prose>,
      );
      expect(screen.getByText('A quote').tagName).toBe('BLOCKQUOTE');
    });

    it('styles inline code', () => {
      render(
        <Prose data-testid="prose">
          <code>const x = 1</code>
        </Prose>,
      );
      expect(screen.getByText('const x = 1').tagName).toBe('CODE');
    });

    it('styles pre blocks', () => {
      render(
        <Prose data-testid="prose">
          <pre>
            <code>{'console.log("hello")'}</code>
          </pre>
        </Prose>,
      );
      const pre = screen.getByTestId('prose').querySelector('pre');
      expect(pre).toBeInTheDocument();
    });

    it('styles horizontal rules', () => {
      render(
        <Prose data-testid="prose">
          <hr />
        </Prose>,
      );
      const hr = screen.getByTestId('prose').querySelector('hr');
      expect(hr).toBeInTheDocument();
    });

    it('styles tables', () => {
      render(
        <Prose data-testid="prose">
          <table>
            <thead>
              <tr>
                <th>Header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell</td>
              </tr>
            </tbody>
          </table>
        </Prose>,
      );
      const table = screen.getByTestId('prose').querySelector('table');
      expect(table).toBeInTheDocument();
      expect(screen.getByText('Header').tagName).toBe('TH');
      expect(screen.getByText('Cell').tagName).toBe('TD');
    });
  });

  // === Slot props ===
  describe('slot props', () => {
    it('merges sp className on root', () => {
      render(
        <Prose sp={{ root: { className: 'sp-root' } }} data-testid="prose">
          Content
        </Prose>,
      );
      expect(screen.getByTestId('prose')).toHaveClass('sp-root');
    });

    it('merges sp style on root', () => {
      render(
        <Prose sp={{ root: { style: { marginTop: '5px' } } }} data-testid="prose">
          Content
        </Prose>,
      );
      expect(screen.getByTestId('prose')).toHaveStyle({ marginTop: '5px' });
    });
  });
});
