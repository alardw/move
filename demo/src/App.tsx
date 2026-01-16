import { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { Sidebar, Tooltip, IconProvider, ThemeProvider, darkTheme, lightTheme, Button } from 'move';
import type { Theme } from 'move';
import * as LucideIcons from 'lucide-react';
import {
  Play, Layers, AlertTriangle, Square, MousePointer,
  User, CheckSquare, ChevronDown, Menu, MessageSquare,
  List, Tag, AlignJustify, Navigation,
  MessageCircle, Loader, Circle, ScrollText, ChevronDownSquare,
  Minus, Sliders, ToggleLeft, LayoutGrid, Bell, ToggleRight,
  Grid, Wrench, Info, FileText, Image, PanelBottom, Sun, Moon, Sparkles
} from 'lucide-react';
import './App.css';

// Import custom Streamline Micro Line SVG icons
import SlWifiIcon from './assets/icons/Micro Line/Computer Devices/Connection/Wifi.svg?react';
import SlBluetoothIcon from './assets/icons/Micro Line/Computer Devices/Connection/Bluetooth.svg?react';
import SlAiSparkIcon from './assets/icons/Micro Line/Artificial Intelligence/AI Sparkle/Ai Spark Starlight.svg?react';
import SlTargetIcon from './assets/icons/Micro Line/Business/Business Strategy/Target.svg?react';
import SlBatteryIcon from './assets/icons/Micro Line/Computer Devices/Battery/Battery Full.svg?react';
import SlChipIcon from './assets/icons/Micro Line/Computer Devices/Chips/Micro Chip 1.svg?react';
import SlLaptopIcon from './assets/icons/Micro Line/Computer Devices/Computer/Computer Laptop.svg?react';
import SlMegaphoneIcon from './assets/icons/Micro Line/Business/Business Strategy/Announcement Megaphone.svg?react';
import SlStartupIcon from './assets/icons/Micro Line/Business/Business Strategy/Startup.svg?react';
import SlShieldIcon from './assets/icons/Micro Line/Business/Business Strategy/Security Shield.svg?react';

const customIcons: Record<string, React.ComponentType<any>> = {
  'sl-wifi': SlWifiIcon,
  'sl-bluetooth': SlBluetoothIcon,
  'sl-ai-spark': SlAiSparkIcon,
  'sl-target': SlTargetIcon,
  'sl-battery': SlBatteryIcon,
  'sl-chip': SlChipIcon,
  'sl-laptop': SlLaptopIcon,
  'sl-megaphone': SlMegaphoneIcon,
  'sl-startup': SlStartupIcon,
  'sl-shield': SlShieldIcon,
};

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const iconResolver = (name: string) => {
  if (customIcons[name]) return customIcons[name];
  const icons = LucideIcons as Record<string, any>;
  return icons[toPascalCase(name)] || icons[name] || null;
};

// Component demos
import { AccordionDemo } from './demos/AccordionDemo';
import { AlertDialogDemo } from './demos/AlertDialogDemo';
import { ButtonDemo } from './demos/ButtonDemo';
import { DockDemo } from './demos/DockDemo';
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
import { MaterialDemo } from './demos/MaterialDemo';

const components = [
  { name: 'Animation', component: AnimationDemo, icon: Play },
  { name: 'Material', component: MaterialDemo, icon: Sparkles },
  { name: 'Accordion', component: AccordionDemo, icon: Layers },
  { name: 'AlertDialog', component: AlertDialogDemo, icon: AlertTriangle },
  { name: 'AspectRatio', component: AspectRatioDemo, icon: Image },
  { name: 'Button', component: ButtonDemo, icon: MousePointer },
  { name: 'Avatar', component: AvatarDemo, icon: User },
  { name: 'Checkbox', component: CheckboxDemo, icon: CheckSquare },
  { name: 'Collapsible', component: CollapsibleDemo, icon: ChevronDown },
  { name: 'ContextMenu', component: ContextMenuDemo, icon: Menu },
  { name: 'Dialog', component: DialogDemo, icon: MessageSquare },
  { name: 'Dock', component: DockDemo, icon: PanelBottom },
  { name: 'DropdownMenu', component: DropdownMenuDemo, icon: List },
  { name: 'Form', component: FormDemo, icon: FileText },
  { name: 'HoverCard', component: HoverCardDemo, icon: Square },
  { name: 'Icon', component: IconDemo, icon: Grid },
  { name: 'Label', component: LabelDemo, icon: Tag },
  { name: 'Menubar', component: MenubarDemo, icon: AlignJustify },
  { name: 'NavigationMenu', component: NavigationMenuDemo, icon: Navigation },
  { name: 'Popover', component: PopoverDemo, icon: MessageCircle },
  { name: 'Progress', component: ProgressDemo, icon: Loader },
  { name: 'RadioGroup', component: RadioGroupDemo, icon: Circle },
  { name: 'ScrollArea', component: ScrollAreaDemo, icon: ScrollText },
  { name: 'Select', component: SelectDemo, icon: ChevronDownSquare },
  { name: 'Separator', component: SeparatorDemo, icon: Minus },
  { name: 'Slider', component: SliderDemo, icon: Sliders },
  { name: 'Switch', component: SwitchDemo, icon: ToggleLeft },
  { name: 'Tabs', component: TabsDemo, icon: LayoutGrid },
  { name: 'Toast', component: ToastDemo, icon: Bell },
  { name: 'Toggle', component: ToggleDemo, icon: ToggleRight },
  { name: 'ToggleGroup', component: ToggleGroupDemo, icon: Grid },
  { name: 'Toolbar', component: ToolbarDemo, icon: Wrench },
  { name: 'Tooltip', component: TooltipDemo, icon: Info },
];

function getComponentFromHash() {
  const hash = window.location.hash.slice(1);
  const found = components.find(c => c.name.toLowerCase() === hash.toLowerCase());
  return found ? found.name : 'Animation';
}

function AnimatedLogo() {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.char');

    const runAnimation = () => {
      // Animate out (up)
      animate(chars, {
        y: '-100%',
        duration: 400,
        ease: 'in(3)',
        delay: stagger(30),
        onComplete: () => {
          // Instantly move to bottom, then animate in
          animate(chars, {
            y: ['100%', '0%'],
            duration: 400,
            ease: 'out(3)',
            delay: stagger(30),
          });
        }
      });
    };

    // Run every 10 seconds
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

  const toggleTheme = () => {
    const newTheme = theme.name === 'dark' ? lightTheme : darkTheme;
    localStorage.setItem('move-theme', newTheme.name);
    setTheme(newTheme);
  };

  const ActiveDemo = components.find(c => c.name === activeComponent)?.component;

  return (
    <ThemeProvider theme={theme}>
      <IconProvider resolver={iconResolver}>
        <Tooltip.Provider>
          <div className="app">
            <Sidebar.Root className="sidebar" collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed}>
              <Sidebar.Header>
                <AnimatedLogo />
                <Sidebar.Toggle />
              </Sidebar.Header>
              <Sidebar.Content>
                {components.map(({ name, icon: Icon }) => (
                  <Sidebar.Item
                    key={name}
                    icon={<Icon />}
                    active={activeComponent === name}
                    onClick={() => handleComponentChange(name)}
                  >
                    {name}
                  </Sidebar.Item>
                ))}
              </Sidebar.Content>
              <Sidebar.Footer>
                <Button variant="ghost" onClick={toggleTheme}>
                  {theme.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  {theme.name === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </Sidebar.Footer>
            </Sidebar.Root>
            <main className="main-content" style={{ marginLeft: sidebarCollapsed ? '4rem' : '15rem' }}>
              <div className="demo-container">
                {ActiveDemo && <ActiveDemo />}
              </div>
            </main>
          </div>
        </Tooltip.Provider>
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
