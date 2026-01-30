import { useState } from 'react';
import { Dropdown, Button, MoveProvider } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack } from '../components';
import { ChevronRight, User, Settings, LogOut, Copy, Scissors, Clipboard, Mail, MessageSquare, PlusCircle } from 'lucide-react';

function BasicExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button>Open Menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Item>New Tab</Dropdown.Item>
          <Dropdown.Item>New Window</Dropdown.Item>
          <Dropdown.Item disabled>New Private Window</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Settings</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

function WithIconsExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Account</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Label>My Account</Dropdown.Label>
          <Dropdown.Separator />
          <Dropdown.Item><User size={14} /> Profile</Dropdown.Item>
          <Dropdown.Item><Settings size={14} /> Settings</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item><LogOut size={14} /> Log Out</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

function CheckboxExample() {
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showStatusbar, setShowStatusbar] = useState(true);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">View Options</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Label>Panels</Dropdown.Label>
          <Dropdown.Separator />
          <Dropdown.CheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Toolbar
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Sidebar
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem checked={showStatusbar} onCheckedChange={setShowStatusbar}>
            Status Bar
          </Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}


function SubmenuExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Edit</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Item><Scissors size={14} /> Cut</Dropdown.Item>
          <Dropdown.Item><Copy size={14} /> Copy</Dropdown.Item>
          <Dropdown.Item><Clipboard size={14} /> Paste</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Sub>
            <Dropdown.SubTrigger>
              <PlusCircle size={14} /> Share
              <span style={{ marginLeft: 'auto' }}><ChevronRight size={14} /></span>
            </Dropdown.SubTrigger>
            <Dropdown.Portal>
              <Dropdown.SubContent sideOffset={4}>
                <Dropdown.Item><Mail size={14} /> Email</Dropdown.Item>
                <Dropdown.Item><MessageSquare size={14} /> Message</Dropdown.Item>
              </Dropdown.SubContent>
            </Dropdown.Portal>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

function ManyItemsExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">Select Country</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content sideOffset={5}>
          <Dropdown.Label>Europe</Dropdown.Label>
          <Dropdown.Item>Austria</Dropdown.Item>
          <Dropdown.Item>Belgium</Dropdown.Item>
          <Dropdown.Item>Czech Republic</Dropdown.Item>
          <Dropdown.Item>Denmark</Dropdown.Item>
          <Dropdown.Item>Finland</Dropdown.Item>
          <Dropdown.Item>France</Dropdown.Item>
          <Dropdown.Item>Germany</Dropdown.Item>
          <Dropdown.Item>Greece</Dropdown.Item>
          <Dropdown.Item>Ireland</Dropdown.Item>
          <Dropdown.Item>Italy</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Label>Americas</Dropdown.Label>
          <Dropdown.Item>Argentina</Dropdown.Item>
          <Dropdown.Item>Brazil</Dropdown.Item>
          <Dropdown.Item>Canada</Dropdown.Item>
          <Dropdown.Item>Chile</Dropdown.Item>
          <Dropdown.Item>Colombia</Dropdown.Item>
          <Dropdown.Item>Mexico</Dropdown.Item>
          <Dropdown.Item>United States</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Label>Asia</Dropdown.Label>
          <Dropdown.Item>China</Dropdown.Item>
          <Dropdown.Item>India</Dropdown.Item>
          <Dropdown.Item>Japan</Dropdown.Item>
          <Dropdown.Item>South Korea</Dropdown.Item>
          <Dropdown.Item>Singapore</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}

function CustomStylingExample() {
  return (
    <MoveProvider pt={{
      DropdownContent: { content: { style: { borderColor: 'var(--move-primary)', minWidth: '14rem' } } },
      DropdownLabel: { label: { style: { color: 'var(--move-primary)' } } },
    }}>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button>Styled Menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Portal>
          <Dropdown.Content sideOffset={5}>
            <Dropdown.Label>Customized</Dropdown.Label>
            <Dropdown.Separator />
            <Dropdown.Item>Option A</Dropdown.Item>
            <Dropdown.Item>Option B</Dropdown.Item>
            <Dropdown.Item>Option C</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown.Root>
    </MoveProvider>
  );
}

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Basic dropdown with items and separator.',
    component: <BasicExample />,
    code: `import { Dropdown, Button } from 'move';

<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button>Open Menu</Button>
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content sideOffset={5}>
      <Dropdown.Item>New Tab</Dropdown.Item>
      <Dropdown.Item>New Window</Dropdown.Item>
      <Dropdown.Item disabled>New Private Window</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item>Settings</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown.Root>`,
  },
  {
    id: 'icons',
    name: 'With Icons',
    description: 'Items with leading icons and group labels.',
    component: <WithIconsExample />,
    code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">Account</Button>
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content sideOffset={5}>
      <Dropdown.Label>My Account</Dropdown.Label>
      <Dropdown.Separator />
      <Dropdown.Item><User size={14} /> Profile</Dropdown.Item>
      <Dropdown.Item><Settings size={14} /> Settings</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Item><LogOut size={14} /> Log Out</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown.Root>`,
  },
  {
    id: 'checkbox',
    name: 'Checkbox Items',
    description: 'Toggleable options that stay open when clicked.',
    component: <CheckboxExample />,
    code: `const [showToolbar, setShowToolbar] = useState(true);
const [showSidebar, setShowSidebar] = useState(false);

<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">View Options</Button>
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content sideOffset={5}>
      <Dropdown.Label>Panels</Dropdown.Label>
      <Dropdown.Separator />
      <Dropdown.CheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
        Toolbar
      </Dropdown.CheckboxItem>
      <Dropdown.CheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
        Sidebar
      </Dropdown.CheckboxItem>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown.Root>`,
  },
  {
    id: 'submenu',
    name: 'Submenus',
    description: 'Nested menus with sub-triggers and sub-content.',
    component: <SubmenuExample />,
    code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">Edit</Button>
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content sideOffset={5}>
      <Dropdown.Item>Cut</Dropdown.Item>
      <Dropdown.Item>Copy</Dropdown.Item>
      <Dropdown.Item>Paste</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Sub>
        <Dropdown.SubTrigger>
          Share <ChevronRight />
        </Dropdown.SubTrigger>
        <Dropdown.Portal>
          <Dropdown.SubContent sideOffset={4}>
            <Dropdown.Item>Email</Dropdown.Item>
            <Dropdown.Item>Message</Dropdown.Item>
          </Dropdown.SubContent>
        </Dropdown.Portal>
      </Dropdown.Sub>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown.Root>`,
  },
  {
    id: 'many-items',
    name: 'Many Items',
    description: 'A long menu with grouped items and staggered entry animation.',
    component: <ManyItemsExample />,
    code: `<Dropdown.Root>
  <Dropdown.Trigger asChild>
    <Button variant="secondary">Select Country</Button>
  </Dropdown.Trigger>
  <Dropdown.Portal>
    <Dropdown.Content sideOffset={5}>
      <Dropdown.Label>Europe</Dropdown.Label>
      <Dropdown.Item>Austria</Dropdown.Item>
      <Dropdown.Item>Belgium</Dropdown.Item>
      <Dropdown.Item>France</Dropdown.Item>
      <Dropdown.Item>Germany</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Label>Americas</Dropdown.Label>
      <Dropdown.Item>Brazil</Dropdown.Item>
      <Dropdown.Item>Canada</Dropdown.Item>
      <Dropdown.Item>United States</Dropdown.Item>
      <Dropdown.Separator />
      <Dropdown.Label>Asia</Dropdown.Label>
      <Dropdown.Item>Japan</Dropdown.Item>
      <Dropdown.Item>South Korea</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Portal>
</Dropdown.Root>`,
  },
  {
    id: 'custom',
    name: 'Custom Styling',
    description: 'Override styles via MoveProvider pass-through.',
    component: <CustomStylingExample />,
    code: `<MoveProvider pt={{
  DropdownContent: {
    content: { style: { borderColor: 'var(--move-primary)', minWidth: '14rem' } }
  },
  DropdownLabel: {
    label: { style: { color: 'var(--move-primary)' } }
  },
}}>
  <Dropdown.Root>
    <Dropdown.Trigger asChild>
      <Button>Styled Menu</Button>
    </Dropdown.Trigger>
    <Dropdown.Portal>
      <Dropdown.Content sideOffset={5}>
        <Dropdown.Label>Customized</Dropdown.Label>
        <Dropdown.Separator />
        <Dropdown.Item>Option A</Dropdown.Item>
        <Dropdown.Item>Option B</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Portal>
  </Dropdown.Root>
</MoveProvider>`,
  },
];

export function DropdownDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="Dropdown"
        description="An animated dropdown with items, checkboxes, radio groups, and submenus."
      />
      <DocPage.Examples examples={examples} />
    </DocPage.Root>
  );
}
