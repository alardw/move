import type { ReactNode, ComponentType } from 'react';

/* ── SidebarLayout ── */

interface SidebarLayoutProps {
  collapsed: boolean;
  sidebar: ReactNode;
  children: ReactNode;
}

export function SidebarLayout({ collapsed, sidebar, children }: SidebarLayoutProps) {
  return (
    <div className="app">
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
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
  return (
    <button
      className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
      onClick={onClick}
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
