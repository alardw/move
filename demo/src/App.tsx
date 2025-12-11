import { useState, useEffect } from 'react';
import { Tooltip } from 'move';
import './App.css';

// Component demos
import { AccordionDemo } from './demos/AccordionDemo';
import { AlertDialogDemo } from './demos/AlertDialogDemo';
import { ButtonDemo } from './demos/ButtonDemo';
import { AvatarDemo } from './demos/AvatarDemo';
import { CheckboxDemo } from './demos/CheckboxDemo';
import { CollapsibleDemo } from './demos/CollapsibleDemo';
import { ContextMenuDemo } from './demos/ContextMenuDemo';
import { DialogDemo } from './demos/DialogDemo';
import { DropdownMenuDemo } from './demos/DropdownMenuDemo';
import { HoverCardDemo } from './demos/HoverCardDemo';
import { IconDemo } from './demos/IconDemo';
import { LabelDemo } from './demos/LabelDemo';
import { MenubarDemo } from './demos/MenubarDemo';
import { NavigationMenuDemo } from './demos/NavigationMenuDemo';
import { PopoverDemo } from './demos/PopoverDemo';
import { ProgressDemo } from './demos/ProgressDemo';
import { RadioGroupDemo } from './demos/RadioGroupDemo';
import { ScrollAreaDemo } from './demos/ScrollAreaDemo';
import { SelectDemo } from './demos/SelectDemo';
import { SeparatorDemo } from './demos/SeparatorDemo';
import { SliderDemo } from './demos/SliderDemo';
import { SwitchDemo } from './demos/SwitchDemo';
import { TabsDemo } from './demos/TabsDemo';
import { ToastDemo } from './demos/ToastDemo';
import { ToggleDemo } from './demos/ToggleDemo';
import { ToggleGroupDemo } from './demos/ToggleGroupDemo';
import { ToolbarDemo } from './demos/ToolbarDemo';
import { TooltipDemo } from './demos/TooltipDemo';
import { FormDemo } from './demos/FormDemo';
import { AspectRatioDemo } from './demos/AspectRatioDemo';
import { AnimationDemo } from './demos/AnimationDemo';

const components = [
  { name: 'Animation', component: AnimationDemo },
  { name: 'Accordion', component: AccordionDemo },
  { name: 'AlertDialog', component: AlertDialogDemo },
  { name: 'AspectRatio', component: AspectRatioDemo },
  { name: 'Button', component: ButtonDemo },
  { name: 'Avatar', component: AvatarDemo },
  { name: 'Checkbox', component: CheckboxDemo },
  { name: 'Collapsible', component: CollapsibleDemo },
  { name: 'ContextMenu', component: ContextMenuDemo },
  { name: 'Dialog', component: DialogDemo },
  { name: 'DropdownMenu', component: DropdownMenuDemo },
  { name: 'Form', component: FormDemo },
  { name: 'HoverCard', component: HoverCardDemo },
  { name: 'Icon', component: IconDemo },
  { name: 'Label', component: LabelDemo },
  { name: 'Menubar', component: MenubarDemo },
  { name: 'NavigationMenu', component: NavigationMenuDemo },
  { name: 'Popover', component: PopoverDemo },
  { name: 'Progress', component: ProgressDemo },
  { name: 'RadioGroup', component: RadioGroupDemo },
  { name: 'ScrollArea', component: ScrollAreaDemo },
  { name: 'Select', component: SelectDemo },
  { name: 'Separator', component: SeparatorDemo },
  { name: 'Slider', component: SliderDemo },
  { name: 'Switch', component: SwitchDemo },
  { name: 'Tabs', component: TabsDemo },
  { name: 'Toast', component: ToastDemo },
  { name: 'Toggle', component: ToggleDemo },
  { name: 'ToggleGroup', component: ToggleGroupDemo },
  { name: 'Toolbar', component: ToolbarDemo },
  { name: 'Tooltip', component: TooltipDemo },
];

function getComponentFromHash() {
  const hash = window.location.hash.slice(1);
  const found = components.find(c => c.name.toLowerCase() === hash.toLowerCase());
  return found ? found.name : 'Animation';
}

function App() {
  const [activeComponent, setActiveComponent] = useState(getComponentFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveComponent(getComponentFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleComponentChange = (name: string) => {
    window.location.hash = name.toLowerCase();
    setActiveComponent(name);
  };

  const ActiveDemo = components.find(c => c.name === activeComponent)?.component;

  return (
    <Tooltip.Provider>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>Move</h1>
            <span className="subtitle">Component Library</span>
          </div>
          <nav className="sidebar-nav">
            {components.map(({ name }) => (
              <button
                key={name}
                className={`nav-item ${activeComponent === name ? 'active' : ''}`}
                onClick={() => handleComponentChange(name)}
              >
                {name}
              </button>
            ))}
          </nav>
        </aside>
        <main className="main-content">
          <header className="content-header">
            <h2>{activeComponent}</h2>
          </header>
          <div className="demo-container">
            {ActiveDemo && <ActiveDemo />}
          </div>
        </main>
      </div>
    </Tooltip.Provider>
  );
}

export default App;
