// Generated from ChatBubble.spec.ts
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChatBubble } from './ChatBubble';

describe('ChatBubble', () => {
  // === Root ===
  describe('Root', () => {
    it('renders with data-placement attribute', () => {
      render(
        <ChatBubble.Root data-testid="root">
          <ChatBubble.Container>
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-placement', 'start');
    });

    it('defaults to placement=start', () => {
      render(
        <ChatBubble.Root data-testid="root">
          <ChatBubble.Container>
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-placement', 'start');
    });

    it('supports placement=end', () => {
      render(
        <ChatBubble.Root placement="end" data-testid="root">
          <ChatBubble.Container>
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('root')).toHaveAttribute('data-placement', 'end');
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <ChatBubble.Root ref={ref}>
          <ChatBubble.Container>
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('forwards className and style', () => {
      render(
        <ChatBubble.Root className="custom" style={{ marginTop: '10px' }} data-testid="root">
          <ChatBubble.Container>
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      const el = screen.getByTestId('root');
      expect(el).toHaveClass('custom');
      expect(el).toHaveStyle({ marginTop: '10px' });
    });
  });

  // === Container ===
  describe('Container', () => {
    it('renders data-variant attribute', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container variant="primary" data-testid="container">
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'primary');
    });

    it('defaults to variant=neutral', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container data-testid="container">
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('container')).toHaveAttribute('data-variant', 'neutral');
    });

    it('shows tail via data-tail attribute', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container tail data-testid="container">
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('container')).toHaveAttribute('data-tail');
    });

    it('inherits placement from Root context', () => {
      render(
        <ChatBubble.Root placement="end">
          <ChatBubble.Container data-testid="container">
            <ChatBubble.Content>Hello</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByTestId('container')).toHaveAttribute('data-placement', 'end');
    });
  });

  // === Avatar ===
  describe('Avatar', () => {
    it('renders children', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Avatar>AV</ChatBubble.Avatar>
        </ChatBubble.Root>,
      );
      expect(screen.getByText('AV')).toBeInTheDocument();
    });
  });

  // === Header ===
  describe('Header', () => {
    it('renders children', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container>
            <ChatBubble.Header>Sender Name</ChatBubble.Header>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByText('Sender Name')).toBeInTheDocument();
    });
  });

  // === Content ===
  describe('Content', () => {
    it('renders children', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container>
            <ChatBubble.Content>Message body</ChatBubble.Content>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByText('Message body')).toBeInTheDocument();
    });
  });

  // === Footer ===
  describe('Footer', () => {
    it('renders children', () => {
      render(
        <ChatBubble.Root>
          <ChatBubble.Container>
            <ChatBubble.Footer>2:30 PM</ChatBubble.Footer>
          </ChatBubble.Container>
        </ChatBubble.Root>,
      );
      expect(screen.getByText('2:30 PM')).toBeInTheDocument();
    });
  });
});
