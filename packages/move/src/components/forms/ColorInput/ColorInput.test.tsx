// Generated from ColorInput.spec.ts
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ColorInput } from './ColorInput';

/** Let the exit animation and the focus restore it triggers land inside act,
 *  so a state update cannot surface as an act() warning after teardown. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 250));
  });

describe('ColorInput', () => {
  // === Rendering ===
  describe('rendering', () => {
    it('renders root element', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('renders input element', () => {
      render(<ColorInput />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders swatch with role=button', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toBeInTheDocument();
    });

    it('forwards className to root', () => {
      const { container } = render(<ColorInput className="custom" />);
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style to root', () => {
      const { container } = render(<ColorInput style={{ margin: '10px' }} />);
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(<ColorInput ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('defaults to data-variant=outlined', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'outlined');
    });

    it('defaults to data-size=md', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-format=hex', () => {
      const { container } = render(<ColorInput />);
      expect(container.firstElementChild).toHaveAttribute('data-format', 'hex');
    });

    it('applies custom variant', () => {
      const { container } = render(<ColorInput variant="filled" />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'filled');
    });

    it('applies custom size', () => {
      const { container } = render(<ColorInput size="lg" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('sets data-disabled when disabled', () => {
      const { container } = render(<ColorInput disabled />);
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });

    it('sets data-invalid when invalid', () => {
      const { container } = render(<ColorInput invalid />);
      expect(container.firstElementChild).toHaveAttribute('data-invalid');
    });

    it('sets data-readonly when readOnly', () => {
      const { container } = render(<ColorInput readOnly />);
      expect(container.firstElementChild).toHaveAttribute('data-readonly');
    });
  });

  // === Swatch ===
  describe('swatch', () => {
    it('swatch has aria-label', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('aria-label', 'Open color picker');
    });

    it('swatch has tabIndex=-1', () => {
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('tabindex', '-1');
    });

    it('swatch displays current color as backgroundColor', () => {
      const { container } = render(<ColorInput defaultValue="#ff0000" />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      expect(swatch.style.backgroundColor).toBeTruthy();
    });

    it('swatch custom label via labels prop', () => {
      const { container } = render(<ColorInput labels={{ swatch: 'Choose' }} />);
      const swatch = container.querySelector('[role="button"]');
      expect(swatch).toHaveAttribute('aria-label', 'Choose');
    });
  });

  // === Input ===
  describe('input', () => {
    it('input shows current value', () => {
      render(<ColorInput defaultValue="#ff0000" />);
      expect(screen.getByRole('combobox')).toHaveValue('#ff0000');
    });

    it('input shows placeholder', () => {
      render(<ColorInput placeholder="Pick color" />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('placeholder', 'Pick color');
    });

    it('input is disabled when component is disabled', () => {
      render(<ColorInput disabled />);
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('forwards name to input', () => {
      render(<ColorInput name="color" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('name', 'color');
    });

    it('forwards id to input', () => {
      render(<ColorInput id="my-color" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('id', 'my-color');
    });

    it('forwards required to input', () => {
      render(<ColorInput required />);
      expect(screen.getByRole('combobox')).toHaveAttribute('required');
    });
  });

  // === Input editing ===
  describe('input editing', () => {
    it('snapshots value on focus', async () => {
      const user = userEvent.setup();
      render(<ColorInput defaultValue="#ff0000" />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      expect(input).toHaveValue('#ff0000');
    });

    it('validates and commits valid color on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '#00ff00');
      await user.tab();
      expect(onChange).toHaveBeenCalled();
    });

    it('does not commit invalid color on blur', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, 'not-a-color');
      await user.tab();
      expect(onChange).not.toHaveBeenCalled();
    });

    // behavior-3: every test above drives defaultValue (uncontrolled). The spec declares
    // the value/defaultValue/onValueChange triad, so the controlled half — parent owns
    // the value — is public API too.
    it('controlled: value owns the input, a commit only reports', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput value="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('#ff0000');

      await user.click(input);
      await user.clear(input);
      await user.type(input, '#00ff00');
      await user.tab();
      expect(onChange).toHaveBeenCalledWith('#00ff00');
      // The parent never fed the new value back, so it must snap back to the prop
      // rather than keep the typed value in its own state.
      expect(input).toHaveValue('#ff0000');
    });

    // Enter used to blur(), which committed the draft but dropped focus on
    // <body>. It now commits in place and leaves the caret where it was.
    it('Enter commits the typed draft without moving focus', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#ff0000" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.clear(input);
      await user.type(input, '#00ff00');
      await user.keyboard('{Enter}');

      expect(onChange).toHaveBeenCalledWith('#00ff00');
      expect(document.activeElement).toBe(input);
    });
  });

  // === Popover ===
  describe('popover', () => {
    it('swatch click opens popover with ColorPicker', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      await user.click(swatch);
      // ColorPicker renders sliders inside popover content
      expect(
        document.body.querySelector('[data-radix-popper-content-wrapper]'),
      ).toBeInTheDocument();
    });

    it('disabled prevents swatch click', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput disabled />);
      const swatch = container.querySelector('[role="button"]') as HTMLElement;
      await user.click(swatch);
      expect(
        document.body.querySelector('[data-radix-popper-content-wrapper]'),
      ).not.toBeInTheDocument();
    });
  });

  // === Callbacks ===
  describe('callbacks', () => {
    it('calls onFocus when input is focused', async () => {
      const user = userEvent.setup();
      const onFocus = vi.fn();
      render(<ColorInput onFocus={onFocus} />);
      await user.click(screen.getByRole('combobox'));
      expect(onFocus).toHaveBeenCalled();
    });

    it('calls onBlur when input is blurred', async () => {
      const user = userEvent.setup();
      const onBlur = vi.fn();
      render(<ColorInput onBlur={onBlur} />);
      await user.click(screen.getByRole('combobox'));
      await user.tab();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  // === Keyboard entry into the picker ===
  describe('keyboard open', () => {
    it('ArrowDown opens the popover and moves focus into the picker', async () => {
      const user = userEvent.setup();
      render(<ColorInput />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      await waitFor(() => {
        const popup = document.body.querySelector('[data-radix-popper-content-wrapper]');
        expect(popup).toBeInTheDocument();
        expect(popup?.contains(document.activeElement)).toBe(true);
      });
    });

    // `field-dialog` makes no pointer/keyboard distinction: the panel is
    // portaled, so a pointer open that left focus behind put the next Tab on
    // the following page control while the panel stayed open behind it.
    it('a pointer open also moves focus into the picker', async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput />);
      await user.click(container.querySelector('[role="button"]') as HTMLElement);

      await waitFor(() => {
        const popup = document.body.querySelector('[data-radix-popper-content-wrapper]');
        expect(popup).toBeInTheDocument();
        expect(popup?.contains(document.activeElement)).toBe(true);
      });
    });

    it('Escape returns focus to the field, not <body>', async () => {
      const user = userEvent.setup();
      render(<ColorInput />);
      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).toBeInTheDocument(),
      );

      await user.keyboard('{Escape}');

      // Asserted AFTER the exit animation unmounts the popup. Radix restores
      // focus at unmount, so a check that runs while the popup is still
      // animating out passes on focus that is about to be dropped.
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).not.toBeInTheDocument(),
      );
      await waitFor(() => expect(document.activeElement).toBe(input));
    });

    it('Tab cycles within the panel rather than escaping to the page', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ColorInput />
          <button>after</button>
        </>,
      );
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      const popup = await waitFor(() => {
        const el = document.body.querySelector('[data-radix-popper-content-wrapper]');
        expect(el).toBeInTheDocument();
        return el!;
      });

      // Radix's FocusScope mounts with loop:true, so Tab wraps last→first
      // inside the panel even though it is not a modal focus trap.
      for (let i = 0; i < 6; i++) {
        await user.tab();
        expect(popup.contains(document.activeElement)).toBe(true);
      }
    });

    it('dismisses when focus leaves the panel and its anchor', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ColorInput />
          <button>after</button>
        </>,
      );
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).toBeInTheDocument(),
      );

      // An open panel must not trail behind the user. act() so the close this
      // schedules is flushed — a bare .focus() leaves it pending.
      await act(async () => {
        screen.getByRole('button', { name: 'after' }).focus();
      });

      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).not.toBeInTheDocument(),
      );
    });
  });

  // === Nested popups inside the panel ===
  describe('nested popup', () => {
    const openPanel = async (user: ReturnType<typeof userEvent.setup>) => {
      // The field is the combobox that is a text input; the panel's format
      // control is also a combobox, so query by element rather than by role.
      await user.click(document.querySelector('input[type="text"]') as HTMLElement);
      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).toBeInTheDocument(),
      );
    };

    // A Select inside the panel portals its listbox to the end of <body>, so by
    // DOM containment its focus reads as focus leaving the panel. Dismissing on
    // that closed the panel the instant you opened the format select.
    it('opening the format select keeps the picker panel open', async () => {
      const user = userEvent.setup();
      render(<ColorInput defaultValue="#3366ff" />);
      await openPanel(user);

      await user.click(screen.getByRole('combobox', { name: 'Color format' }));

      await waitFor(() => {
        const layers = document.body.querySelectorAll('[data-radix-popper-content-wrapper]');
        // Both survive: the picker dialog and the format listbox above it.
        expect(layers.length).toBe(2);
      });
      // Queried by DOM, not by role: Radix Select is modal, so while its
      // listbox is open it aria-hides everything behind it — including this
      // dialog. That is correct, and it means a role query cannot see it.
      expect(document.querySelector('[aria-label="Color picker"]')).toBeInTheDocument();
    });
  });

  // === Commit model: panel edits are live, typed text is a draft ===
  describe('commit model', () => {
    const openPanel = async (user: ReturnType<typeof userEvent.setup>, input: HTMLElement) => {
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).toBeInTheDocument(),
      );
    };

    it('Enter commits the typed draft, closes the panel, and keeps focus on the field', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#3366ff" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      await openPanel(user, input);

      // act(): a bare .focus() dispatches the field's onFocus — and its state
      // update — outside React's batching.
      await act(async () => {
        input.focus();
      });
      await user.clear(input);
      await user.type(input, '#ff0000');
      await user.keyboard('{Enter}');
      // Settle first: the close animation and the focus work Radix does at
      // unmount both land inside act this way.
      await settle();

      expect(
        document.body.querySelector('[data-radix-popper-content-wrapper]'),
      ).not.toBeInTheDocument();
      expect(onChange).toHaveBeenCalledWith('#ff0000');
      // It used to blur() here, dropping focus on <body> while leaving the
      // panel open behind it.
      expect(document.activeElement).toBe(input);
    });

    it('Escape abandons the typed draft', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#3366ff" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');

      await user.click(input);
      await user.clear(input);
      await user.type(input, '#ff0000');
      await user.keyboard('{Escape}');

      expect(onChange).not.toHaveBeenCalled();
      await waitFor(() => expect(input).toHaveValue('#3366ff'));
    });

    it('Escape does not roll back what the panel already applied', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<ColorInput defaultValue="#3366ff" onValueChange={onChange} />);
      const input = screen.getByRole('combobox');
      await openPanel(user, input);

      const hue = document.querySelector('[aria-label="Hue"]') as HTMLElement;
      hue.focus();
      await user.keyboard('{ArrowRight}{ArrowRight}');
      const applied = (input as HTMLInputElement).value;
      expect(applied).not.toBe('#3366ff');

      await user.keyboard('{Escape}');
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).not.toBeInTheDocument(),
      );

      // The user watched this land on the field and the swatch. Silently
      // reverting it on close is the worst of both commit models.
      expect(input).toHaveValue(applied);
      await settle();
    });
  });

  // === APG combobox-with-dialog-popup wiring ===
  describe('popup aria', () => {
    it('field announces the picker and its expanded state', async () => {
      const user = userEvent.setup();
      render(<ColorInput />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-haspopup', 'dialog');
      expect(input).toHaveAttribute('aria-expanded', 'false');

      await user.click(input);
      await user.keyboard('{ArrowDown}');

      await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
      expect(input.getAttribute('aria-controls')).toBeTruthy();
    });

    it('names the picker dialog', async () => {
      const user = userEvent.setup();
      render(<ColorInput labels={{ picker: 'Pick a colour' }} />);
      await user.click(screen.getByRole('combobox'));
      await user.keyboard('{ArrowDown}');

      // role="dialog" without an accessible name announces as just "dialog".
      await waitFor(() =>
        expect(screen.getByRole('dialog', { name: 'Pick a colour' })).toBeInTheDocument(),
      );
    });
  });

  // === Close on scroll ===
  describe('close on scroll', () => {
    const openPicker = async () => {
      const user = userEvent.setup();
      const { container } = render(<ColorInput />);
      await user.click(container.querySelector('[role="button"]') as HTMLElement);
      return document.body.querySelector('[data-radix-popper-content-wrapper]') as HTMLElement;
    };

    it('stays open when the picker itself scrolls', async () => {
      const popup = await openPicker();
      expect(popup).toBeInTheDocument();
      fireEvent.scroll(popup);
      expect(
        document.body.querySelector('[data-radix-popper-content-wrapper]'),
      ).toBeInTheDocument();
    });

    it('closes when the page scrolls outside the popup', async () => {
      await openPicker();
      fireEvent.scroll(document);
      await waitFor(() =>
        expect(
          document.body.querySelector('[data-radix-popper-content-wrapper]'),
        ).not.toBeInTheDocument(),
      );
    });
  });
});
