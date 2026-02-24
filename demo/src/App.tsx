import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { animate, stagger } from 'animejs';
import { ThemeProvider, IconProvider, darkTheme, lightTheme, Tooltip, Toast, Sidebar, Spinner, useSidebarContext } from 'move';
import type { Theme } from 'move';
import * as LucideIcons from 'lucide-react';
import {
  Tag, MousePointer, CheckSquare, Layers, MessageSquare, ShieldAlert,
  Palette, Sun, Moon, Star, CircleUser, ChevronDown, Info, RectangleHorizontal, ToggleRight, Circle, Type, Rows3, ListFilter, PanelTop, TextCursorInput, KeyRound, Loader, LoaderCircle, AlignLeft, PanelLeftClose, PanelLeftOpen, Bell, SlidersHorizontal, SeparatorHorizontal,
  CaseSensitive, Heading as HeadingIcon, ExternalLink, Braces, FileText,
  PanelLeft, SquareStack, Columns, ScrollText,
  CalendarDays, CalendarRange, CalendarClock,
  Clock,
  ToggleLeft,
  ChevronsUpDown,
  Menu,
  PanelTopOpen,
  Play,
  Ghost,
  ImageIcon,
  LayoutGrid,
  Table2,
  Navigation,
  ArrowLeftRight,
  BoxSelect
} from 'lucide-react';
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

// Lazy-load helper for named exports
function lazyNamed<T extends Record<string, any>>(
  factory: () => Promise<T>,
  exportName: keyof T,
): React.LazyExoticComponent<React.ComponentType<any>> {
  return lazy(() => factory().then(mod => ({ default: mod[exportName] as React.ComponentType<any> })));
}

// Component demos — lazy-loaded so only the active page is fetched
const AvatarDemo = lazyNamed(() => import('./demos/AvatarDemo'), 'AvatarDemo');
const BadgeDemo = lazyNamed(() => import('./demos/BadgeDemo'), 'BadgeDemo');
const ButtonDemo = lazyNamed(() => import('./demos/ButtonDemo'), 'ButtonDemo');
const CheckboxDemo = lazyNamed(() => import('./demos/CheckboxDemo'), 'CheckboxDemo');
const AccordionDemo = lazyNamed(() => import('./demos/AccordionDemo'), 'AccordionDemo');
const DialogDemo = lazyNamed(() => import('./demos/DialogDemo'), 'DialogDemo');
const DropdownDemo = lazyNamed(() => import('./demos/DropdownDemo'), 'DropdownDemo');
const IconDemo = lazyNamed(() => import('./demos/IconDemo'), 'IconDemo');
const TooltipDemo = lazyNamed(() => import('./demos/TooltipDemo'), 'TooltipDemo');
const SwitchDemo = lazyNamed(() => import('./demos/SwitchDemo'), 'SwitchDemo');
const RadioGroupDemo = lazyNamed(() => import('./demos/RadioGroupDemo'), 'RadioGroupDemo');
const LabelDemo = lazyNamed(() => import('./demos/LabelDemo'), 'LabelDemo');
const ToggleDemo = lazyNamed(() => import('./demos/ToggleDemo'), 'ToggleDemo');
const ThemingDemo = lazyNamed(() => import('./demos/ThemingDemo'), 'ThemingDemo');
const DesignTokensDemo = lazyNamed(() => import('./demos/DesignTokensDemo'), 'DesignTokensDemo');
const ComponentTokensDemo = lazyNamed(() => import('./demos/ComponentTokensDemo'), 'ComponentTokensDemo');
const ToggleGroupDemo = lazyNamed(() => import('./demos/ToggleGroupDemo'), 'ToggleGroupDemo');
const FormFieldDemo = lazyNamed(() => import('./demos/FormFieldDemo'), 'FormFieldDemo');
const SelectDemo = lazyNamed(() => import('./demos/SelectDemo'), 'SelectDemo');
const TabsDemo = lazyNamed(() => import('./demos/TabsDemo'), 'TabsDemo');
const InputTextDemo = lazyNamed(() => import('./demos/InputTextDemo'), 'InputTextDemo');
const PasswordDemo = lazyNamed(() => import('./demos/PasswordDemo'), 'PasswordDemo');
const TextareaDemo = lazyNamed(() => import('./demos/TextareaDemo'), 'TextareaDemo');
const ProgressBarDemo = lazyNamed(() => import('./demos/ProgressBarDemo'), 'ProgressBarDemo');
const SkeletonDemo = lazyNamed(() => import('./demos/SkeletonDemo'), 'SkeletonDemo');
const SpinnerDemo = lazyNamed(() => import('./demos/SpinnerDemo'), 'SpinnerDemo');
const ToastDemo = lazyNamed(() => import('./demos/ToastDemo'), 'ToastDemo');
const InputRangeDemo = lazyNamed(() => import('./demos/InputRangeDemo'), 'InputRangeDemo');
const DividerDemo = lazyNamed(() => import('./demos/DividerDemo'), 'DividerDemo');
const AnimationDemo = lazyNamed(() => import('./demos/AnimationDemo'), 'AnimationDemo');
const AnimationIntroDemo = lazyNamed(() => import('./demos/AnimationIntroDemo'), 'AnimationIntroDemo');
const AnimationMapDemo = lazyNamed(() => import('./demos/AnimationMapDemo'), 'AnimationMapDemo');
const TextDemo = lazyNamed(() => import('./demos/TextDemo'), 'TextDemo');
const HeadingDemo = lazyNamed(() => import('./demos/HeadingDemo'), 'HeadingDemo');
const LinkDemo = lazyNamed(() => import('./demos/LinkDemo'), 'LinkDemo');
const CodeDemo = lazyNamed(() => import('./demos/CodeDemo'), 'CodeDemo');
const ProseDemo = lazyNamed(() => import('./demos/ProseDemo'), 'ProseDemo');
const SidebarDemo = lazyNamed(() => import('./demos/SidebarDemo'), 'SidebarDemo');
const CardDemo = lazyNamed(() => import('./demos/CardDemo'), 'CardDemo');
const SplitterDemo = lazyNamed(() => import('./demos/SplitterDemo'), 'SplitterDemo');
const ScrollAreaDemo = lazyNamed(() => import('./demos/ScrollAreaDemo'), 'ScrollAreaDemo');
const CalendarDemo = lazyNamed(() => import('./demos/CalendarDemo'), 'CalendarDemo');
const DatePickerDemo = lazyNamed(() => import('./demos/DatePickerDemo'), 'DatePickerDemo');
const TimeFieldDemo = lazyNamed(() => import('./demos/TimeFieldDemo'), 'TimeFieldDemo');
const CalendarViewDemo = lazyNamed(() => import('./demos/CalendarViewDemo'), 'CalendarViewDemo');
const CollapsibleDemo = lazyNamed(() => import('./demos/CollapsibleDemo'), 'CollapsibleDemo');
const AlertDemo = lazyNamed(() => import('./demos/AlertDemo'), 'AlertDemo');
const PopoverDemo = lazyNamed(() => import('./demos/PopoverDemo'), 'PopoverDemo');
const EmptyStateDemo = lazyNamed(() => import('./demos/EmptyStateDemo'), 'EmptyStateDemo');
const ImageDemo = lazyNamed(() => import('./demos/ImageDemo'), 'ImageDemo');
const ImageGroupDemo = lazyNamed(() => import('./demos/ImageGroupDemo'), 'ImageGroupDemo');
const TableDemo = lazyNamed(() => import('./demos/TableDemo'), 'TableDemo');
const BreadcrumbDemo = lazyNamed(() => import('./demos/BreadcrumbDemo'), 'BreadcrumbDemo');
const PaginationDemo = lazyNamed(() => import('./demos/PaginationDemo'), 'PaginationDemo');

interface GroupItem {
  name: string;
  component: React.ComponentType;
  icon: React.ComponentType<{ size: number }>;
  children?: { name: string; component: React.ComponentType }[];
}

interface ComponentGroup {
  label: string;
  items: GroupItem[];
}

const componentGroups: ComponentGroup[] = [
  {
    label: 'Theming',
    items: [
      {
        name: 'Overview',
        component: ThemingDemo,
        icon: Palette,
        children: [
          { name: 'Design Tokens', component: DesignTokensDemo },
          { name: 'Component Tokens', component: ComponentTokensDemo },
        ],
      },
      {
        name: 'Animation',
        component: AnimationIntroDemo,
        icon: Play,
        children: [
          { name: 'Easing', component: AnimationDemo },
          { name: 'Component Map', component: AnimationMapDemo },
        ],
      },
    ],
  },
  {
    label: 'Core',
    items: [
      { name: 'Alert', component: AlertDemo, icon: ShieldAlert },
      { name: 'Avatar', component: AvatarDemo, icon: CircleUser },
      { name: 'Button', component: ButtonDemo, icon: MousePointer },
      { name: 'Dropdown', component: DropdownDemo, icon: ChevronDown },
      { name: 'Icon', component: IconDemo, icon: Star },
      { name: 'Tooltip', component: TooltipDemo, icon: Info },
    ],
  },
  {
    label: 'Typography',
    items: [
      { name: 'Text', component: TextDemo, icon: CaseSensitive },
      { name: 'Heading', component: HeadingDemo, icon: HeadingIcon },
      { name: 'Link', component: LinkDemo, icon: ExternalLink },
      { name: 'Code', component: CodeDemo, icon: Braces },
      { name: 'Prose', component: ProseDemo, icon: FileText },
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
      { name: 'InputRange', component: InputRangeDemo, icon: SlidersHorizontal },
      { name: 'InputText', component: InputTextDemo, icon: TextCursorInput },
      { name: 'Password', component: PasswordDemo, icon: KeyRound },
      { name: 'Textarea', component: TextareaDemo, icon: AlignLeft },
      { name: 'Select', component: SelectDemo, icon: ListFilter },
      { name: 'DatePicker', component: DatePickerDemo, icon: CalendarRange },
      { name: 'TimeField', component: TimeFieldDemo, icon: Clock },
    ],
  },
  {
    label: 'Toolbar',
    items: [
      { name: 'ToggleButton', component: ToggleDemo, icon: RectangleHorizontal },
      { name: 'ToggleGroup', component: ToggleGroupDemo, icon: ToggleLeft },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { name: 'Breadcrumb', component: BreadcrumbDemo, icon: Navigation },
      { name: 'Pagination', component: PaginationDemo, icon: ArrowLeftRight },
    ],
  },
  {
    label: 'Panel',
    items: [
      { name: 'Accordion', component: AccordionDemo, icon: Layers },
      { name: 'Collapsible', component: CollapsibleDemo, icon: ChevronsUpDown },
      { name: 'Card', component: CardDemo, icon: SquareStack },
      { name: 'Divider', component: DividerDemo, icon: SeparatorHorizontal },
      { name: 'ScrollArea', component: ScrollAreaDemo, icon: ScrollText },
      { name: 'Sidebar', component: SidebarDemo, icon: PanelLeft },
      { name: 'Splitter', component: SplitterDemo, icon: Columns },
      { name: 'Tabs', component: TabsDemo, icon: PanelTop },
    ],
  },
  {
    label: 'Calendar',
    items: [
      { name: 'Calendar', component: CalendarDemo, icon: CalendarDays },
      { name: 'CalendarView', component: CalendarViewDemo, icon: CalendarClock },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { name: 'Dialog', component: DialogDemo, icon: MessageSquare },
      { name: 'Popover', component: PopoverDemo, icon: PanelTopOpen },
      { name: 'Toast', component: ToastDemo, icon: Bell },
    ],
  },
  {
    label: 'Media',
    items: [
      { name: 'Image', component: ImageDemo, icon: ImageIcon },
      { name: 'ImageGroup', component: ImageGroupDemo, icon: LayoutGrid },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'Table', component: TableDemo, icon: Table2 },
    ],
  },
  {
    label: 'Loading',
    items: [
      { name: 'EmptyState', component: EmptyStateDemo, icon: Ghost },
      { name: 'ProgressBar', component: ProgressBarDemo, icon: Loader },
      { name: 'Skeleton', component: SkeletonDemo, icon: BoxSelect },
      { name: 'Spinner', component: SpinnerDemo, icon: LoaderCircle },
    ],
  },
  {
    label: 'Misc',
    items: [
      { name: 'Badge', component: BadgeDemo, icon: Tag },
    ],
  },
];

const allComponents = componentGroups.flatMap(g =>
  g.items.flatMap(item => [item, ...(item.children ?? [])])
);

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

function AppContent({ activeComponent, onComponentChange, theme, onToggleTheme }: {
  activeComponent: string;
  onComponentChange: (name: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const { collapsed, isMobile, setMobileOpen } = useSidebarContext();

  const ActiveDemo = allComponents.find(c => c.name === activeComponent)?.component;

  const handleItemClick = (name: string) => {
    onComponentChange(name);
    if (isMobile) setMobileOpen(false);
  };

  return (
    <div className="app">
      {isMobile && (
        <div className="mobile-header">
          <Sidebar.Trigger asChild>
            <button className="mobile-menu-btn" aria-label="Toggle menu">
              <Menu size={20} />
            </button>
          </Sidebar.Trigger>
          <span className="sidebar-title" style={{ fontSize: 'var(--move-size-lg)' }}>Move</span>
        </div>
      )}

      <Tooltip.Provider delayDuration={0}>
        <Sidebar.Root style={{ position: 'sticky', top: 0, height: '100vh' }}>
          <Sidebar.Header collapsedChildren={null}>
            <AnimatedLogo />
          </Sidebar.Header>

          <Sidebar.Content>
            {componentGroups.map(group => (
              <Sidebar.Group key={group.label}>
                <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
                {group.items.map(({ name, icon: Icon, children }) => (
                  <div key={name}>
                    <Sidebar.Item
                      icon={<Icon size={18} />}
                      active={activeComponent === name}
                      tooltip={name}
                      onClick={() => handleItemClick(name)}
                    >
                      {name}
                    </Sidebar.Item>
                    {children && !collapsed && children.map(child => (
                      <Sidebar.Item
                        key={child.name}
                        active={activeComponent === child.name}
                        tooltip={child.name}
                        onClick={() => handleItemClick(child.name)}
                        className="sidebar-sub-item"
                      >
                        {child.name}
                      </Sidebar.Item>
                    ))}
                  </div>
                ))}
              </Sidebar.Group>
            ))}
          </Sidebar.Content>

          <Sidebar.Footer>
            <Sidebar.Item
              icon={theme.name === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              tooltip={theme.name === 'dark' ? 'Light' : 'Dark'}
              onClick={onToggleTheme}
            >
              {theme.name === 'dark' ? 'Light' : 'Dark'}
            </Sidebar.Item>
            <Sidebar.Trigger asChild>
              <Sidebar.Item
                icon={collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                tooltip={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? 'Expand' : 'Collapse'}
              </Sidebar.Item>
            </Sidebar.Trigger>
          </Sidebar.Footer>

          <Sidebar.Rail />
        </Sidebar.Root>
      </Tooltip.Provider>

      <main className="main-content">
        <div className="demo-container">
          <Suspense fallback={<div className="demo-loading"><Spinner size="sm" /></div>}>
            {ActiveDemo && <ActiveDemo />}
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [activeComponent, setActiveComponent] = useState(getComponentFromHash);
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

  return (
    <ThemeProvider theme={theme}>
      <IconProvider resolver={iconResolver}>
        <Sidebar.Provider>
          <AppContent
            activeComponent={activeComponent}
            onComponentChange={handleComponentChange}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </Sidebar.Provider>
        <Toast.Viewport />
      </IconProvider>
    </ThemeProvider>
  );
}

export default App;
