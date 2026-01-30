import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { ThemeProvider, IconProvider, darkTheme, lightTheme, Button } from 'move';
import type { Theme } from 'move';
import * as LucideIcons from 'lucide-react';
import {
  Tag, MousePointer, CheckSquare, Layers, MessageSquare,
  Palette, Sun, Moon, Star, CircleUser, ChevronDown, Info, RectangleHorizontal, ToggleRight, Circle, Type, Rows3, ListFilter, PanelTop, TextCursorInput, KeyRound, Loader, LoaderCircle
} from 'lucide-react';
import {
  SidebarLayout, SidebarNav, SidebarNavGroup, SidebarNavItem,
} from './components';
import './App.css';

// Icon resolver
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

// Component demos
import { AvatarDemo } from './demos/AvatarDemo';
import { BadgeDemo } from './demos/BadgeDemo';
import { ButtonDemo } from './demos/ButtonDemo';
import { CheckboxDemo } from './demos/CheckboxDemo';
import { AccordionDemo } from './demos/AccordionDemo';
import { DialogDemo } from './demos/DialogDemo';
import { DropdownDemo } from './demos/DropdownDemo';
import { IconDemo } from './demos/IconDemo';
import { TooltipDemo } from './demos/TooltipDemo';
import { SwitchDemo } from './demos/SwitchDemo';
import { RadioGroupDemo } from './demos/RadioGroupDemo';
import { LabelDemo } from './demos/LabelDemo';
import { ThemeDemo } from './demos/ThemeDemo';
import { ToggleDemo } from './demos/ToggleDemo';
import { FormFieldDemo } from './demos/FormFieldDemo';
import { SelectDemo } from './demos/SelectDemo';
import { TabsDemo } from './demos/TabsDemo';
import { InputTextDemo } from './demos/InputTextDemo';
import { PasswordDemo } from './demos/PasswordDemo';
import { ProgressBarDemo } from './demos/ProgressBarDemo';
import { SpinnerDemo } from './demos/SpinnerDemo';

const componentGroups = [
  {
    label: 'Core',
    items: [
      { name: 'Avatar', component: AvatarDemo, icon: CircleUser },
      { name: 'Button', component: ButtonDemo, icon: MousePointer },
      { name: 'Dropdown', component: DropdownDemo, icon: ChevronDown },
      { name: 'Icon', component: IconDemo, icon: Star },
      { name: 'Tooltip', component: TooltipDemo, icon: Info },
    ],
  },
  {
    label: 'Form',
    items: [
      { name: 'Checkbox', component: CheckboxDemo, icon: CheckSquare },
      { name: 'Label', component: LabelDemo, icon: Type },
      { name: 'RadioGroup', component: RadioGroupDemo, icon: Circle },
      { name: 'Switch', component: SwitchDemo, icon: ToggleRight },
      { name: 'FormField', component: FormFieldDemo, icon: Rows3 },
      { name: 'InputText', component: InputTextDemo, icon: TextCursorInput },
      { name: 'Password', component: PasswordDemo, icon: KeyRound },
      { name: 'Select', component: SelectDemo, icon: ListFilter },
    ],
  },
  {
    label: 'Toolbar',
    items: [
      { name: 'ToggleButton', component: ToggleDemo, icon: RectangleHorizontal },
    ],
  },
  {
    label: 'Panel',
    items: [
      { name: 'Accordion', component: AccordionDemo, icon: Layers },
      { name: 'Tabs', component: TabsDemo, icon: PanelTop },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { name: 'Dialog', component: DialogDemo, icon: MessageSquare },
    ],
  },
  {
    label: 'Loading',
    items: [
      { name: 'ProgressBar', component: ProgressBarDemo, icon: Loader },
      { name: 'Spinner', component: SpinnerDemo, icon: LoaderCircle },
    ],
  },
  {
    label: 'Misc',
    items: [
      { name: 'Badge', component: BadgeDemo, icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Theme', component: ThemeDemo, icon: Palette },
    ],
  },
];

const allComponents = componentGroups.flatMap(g => g.items);

function getComponentFromHash() {
  const hash = window.location.hash.slice(1);
  const found = allComponents.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === hash.toLowerCase());
  return found ? found.name : 'Button';
}

function AnimatedLogo() {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');

    const runAnimation = () => {
      animate(chars, {
        y: '-100%',
        duration: 400,
        ease: 'in(3)',
        delay: stagger(30),
        onComplete: () => {
          animate(chars, {
            y: ['100%', '0%'],
            duration: 400,
            ease: 'out(3)',
            delay: stagger(30),
          });
        }
      });
    };

    const interval = setInterval(runAnimation, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 ref={containerRef} className="sidebar-title">
      {'Move'.split('').map((char, i) => (
        <span key={i} className="char-wrap">
          <span className="char">{char}</span>
        </span>
      ))}
    </h1>
  );
}

function App() {
  const [activeComponent, setActiveComponent] = useState(getComponentFromHash);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('move-theme');
    return stored === 'light' ? lightTheme : darkTheme;
  });

  // Sync hash → state (browser back/forward only)
  useEffect(() => {
    const handleHashChange = () => {
      setActiveComponent(getComponentFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync state → hash (replaceState avoids triggering hashchange)
  useEffect(() => {
    const slug = activeComponent.toLowerCase().replace(/\s+/g, '-');
    if (window.location.hash.slice(1) !== slug) {
      window.history.replaceState(null, '', '#' + slug);
    }
  }, [activeComponent]);

  const handleComponentChange = (name: string) => {
    setActiveComponent(name);
    window.history.pushState(null, '', '#' + name.toLowerCase().replace(/\s+/g, '-'));
  };

  const toggleTheme = () => {
    const newTheme = theme.name === 'dark' ? lightTheme : darkTheme;
    localStorage.setItem('move-theme', newTheme.name);
    setTheme(newTheme);
  };

  const ActiveDemo = allComponents.find(c => c.name === activeComponent)?.component;

  return (
    <ThemeProvider theme={theme}>
      <IconProvider resolver={iconResolver}>
        <SidebarLayout
          collapsed={sidebarCollapsed}
          sidebar={
            <>
              <div className="sidebar-header">
                {!sidebarCollapsed && <AnimatedLogo />}
                <button
                  className="sidebar-toggle"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {sidebarCollapsed ? '→' : '←'}
                </button>
              </div>
              <SidebarNav>
                {componentGroups.map(group => (
                  <SidebarNavGroup key={group.label} label={group.label} collapsed={sidebarCollapsed}>
                    {group.items.map(({ name, icon }) => (
                      <SidebarNavItem
                        key={name}
                        icon={icon}
                        label={name}
                        active={activeComponent === name}
                        collapsed={sidebarCollapsed}
                        onClick={() => handleComponentChange(name)}
                      />
                    ))}
                  </SidebarNavGroup>
                ))}
              </SidebarNav>
              <div className="sidebar-footer">
                <Button variant="ghost" onClick={toggleTheme} className="sidebar-theme-toggle">
                  {theme.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  {!sidebarCollapsed && (theme.name === 'dark' ? 'Light' : 'Dark')}
                </Button>
              </div>
            </>
          }
        >
          <div className="demo-container">
            {ActiveDemo && <ActiveDemo />}
          </div>
        </SidebarLayout>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
