import { type ReactNode, type ComponentType, useState, useEffect, useCallback } from 'react';
import { Tooltip } from 'move';

/* ── SidebarLayout ── */

interface SidebarLayoutProps {
  collapsed: boolean;
  sidebar: ReactNode;
  children: ReactNode;
  mobileHeader?: ReactNode;
}

export function SidebarLayout({ collapsed, sidebar, children, mobileHeader }: SidebarLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (!e.matches) setMobileOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const toggleMobileOpen = useCallback(() => setMobileOpen(v => !v), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="app">
      {isMobile && (
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={toggleMobileOpen} aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {mobileHeader}
        </div>
      )}
      {isMobile && mobileOpen && (
        <div className="mobile-overlay" onClick={closeMobile} />
      )}
      <aside
        className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${isMobile ? (mobileOpen ? 'sidebar-mobile-open' : 'sidebar-mobile-closed') : ''}`}
        onClick={(e) => {
          // Close mobile sidebar when a nav item is clicked
          if (isMobile && (e.target as HTMLElement).closest('.sidebar-item')) {
            closeMobile();
          }
        }}
      >
        {sidebar}
      </aside>
      <main className={`main-content ${collapsed ? 'main-content-collapsed' : ''}`}>
        {children}
      </main>
    </div>
  );
}

/* ── SidebarNav ── */

interface SidebarNavProps {
  children: ReactNode;
}

export function SidebarNav({ children }: SidebarNavProps) {
  return <nav className="sidebar-nav">{children}</nav>;
}

/* ── SidebarNavGroup ── */

interface SidebarNavGroupProps {
  label: string;
  collapsed?: boolean;
  children: ReactNode;
}

export function SidebarNavGroup({ label, collapsed, children }: SidebarNavGroupProps) {
  return (
    <div className="sidebar-nav-group">
      {!collapsed && <div className="sidebar-nav-group-label">{label}</div>}
      {children}
    </div>
  );
}

/* ── SidebarNavItem ── */

interface SidebarNavItemProps {
  icon: ComponentType<{ size: number }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick: () => void;
}

export function SidebarNavItem({ icon: Icon, label, active, collapsed, onClick }: SidebarNavItemProps) {
  const button = (
    <button
      className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
      onClick={onClick}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip label={label} side="right" sideOffset={8}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
