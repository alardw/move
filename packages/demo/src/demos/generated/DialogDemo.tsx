// Generated from Dialog.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { Dialog, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'overlay:Dialog',
  name: 'Dialog',
  category: 'overlay',
  description: 'Modal dialog overlay with backdrop, spring entrance animation, and structured header/body/footer layout',
  controls: [
    {
      name: 'size',
      kind: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      defaultValue: 'md',
    },
    {
      name: 'modal',
      kind: 'boolean',
      defaultValue: true,
    },
  ],
  initialProps: {
    size: 'md',
    modal: true,
  },
  sections: [
    {
      id: 'basic',
      label: 'Basic Dialog',
      code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Dialog Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <p>Dialog body content goes here.</p>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.FooterEnd>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
          <Button>Confirm</Button>
        </Dialog.FooterEnd>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
      render: (props) => (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>Open Basic Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content size={props.size as 'sm' | 'md' | 'lg' | 'xl' | 'full'}>
              <Dialog.Header>
                <Dialog.Title>Basic Dialog</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <p>This is the dialog body content. It can contain any elements you need.</p>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.FooterEnd>
                  <Dialog.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Dialog.Close>
                  <Button>Confirm</Button>
                </Dialog.FooterEnd>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
    },
    {
      id: 'with-description',
      label: 'With Description',
      code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button variant="secondary">Delete Account</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content size="sm">
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>
          This action cannot be undone. This will permanently delete
          your account and remove your data from our servers.
        </Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.FooterStart>
          <Dialog.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Dialog.Close>
        </Dialog.FooterStart>
        <Dialog.FooterEnd>
          <Button>Delete Account</Button>
        </Dialog.FooterEnd>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>`,
      render: () => (
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="secondary">Delete Account</Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content size="sm">
              <Dialog.Header>
                <Dialog.Title>Are you sure?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Dialog.Description>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </Dialog.Description>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.FooterStart>
                  <Dialog.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Dialog.Close>
                </Dialog.FooterStart>
                <Dialog.FooterEnd>
                  <Button>Delete Account</Button>
                </Dialog.FooterEnd>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ),
    },
    {
      id: 'sizes',
      label: 'Size Variants',
      code: `{/* sm | md | lg | xl | full */}
<Dialog.Content size="lg">...</Dialog.Content>`,
      render: () => (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
            <Dialog.Root key={size}>
              <Dialog.Trigger asChild>
                <Button variant="secondary">{size}</Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content size={size}>
                  <Dialog.Header>
                    <Dialog.Title>Size: {size}</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <p>This dialog uses the {size} size variant.</p>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.FooterEnd>
                      <Dialog.Close asChild>
                        <Button variant="secondary">Close</Button>
                      </Dialog.Close>
                    </Dialog.FooterEnd>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          ))}
        </div>
      ),
    },
  ],
  render: (props) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size={props.size as 'sm' | 'md' | 'lg' | 'xl' | 'full'}>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <p>Dialog body content goes here. Customize the size using the control above.</p>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.FooterEnd>
              <Dialog.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Dialog.Close>
              <Button>Confirm</Button>
            </Dialog.FooterEnd>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
};
