# Feature Patterns Reference

## What is a feature?

A feature is a functional area of an app that spans multiple pages and composites. It's the unit of work when building "add authentication" or "add project management".

## Decomposition

Every feature breaks down into:

| Artifact | Description | Example (auth feature) |
|----------|-------------|----------------------|
| Pages | Individual routes | LoginPage, SignupPage, ForgotPasswordPage |
| Composites | Shared UI | AuthFormCard, SocialLoginButtons, PasswordStrength |
| State | Shared context/hooks | useAuth, AuthProvider |
| Routes | URL structure | /login, /signup, /forgot-password |

## Common features

### Authentication
- Pages: Login, Signup, Forgot Password, Reset Password
- Composites: AuthFormCard, SocialLoginButtons
- State: useAuth (current user, login/logout)
- Layout: minimal shell (no sidebar)

### Dashboard
- Pages: Overview, Analytics, Reports
- Composites: StatCard, ChartPanel, ActivityFeed
- State: useDateRange, useFilters
- Layout: sidebar shell

### Settings
- Pages: one page with Tabs, or multiple sub-routes
- Composites: SettingsSection, DangerZone
- State: useSettings (load/save)
- Layout: sidebar shell

### CRUD (list + detail + create/edit)
- Pages: List, Detail, Create, Edit
- Composites: EntityCard, EntityForm, FilterBar
- State: useEntity (CRUD operations)
- Layout: sidebar shell with breadcrumb trail

## Cross-page state

When pages share state, use one of:
1. **React Context** — wrap the feature's routes in a provider
2. **URL state** — search params for filters, selections
3. **External store** — for complex state (Zustand, Redux)

Keep state minimal — prefer URL params over context for navigation-related state.

## Navigation

Use Move components for all navigation:
- `Sidebar.Item` for feature-level nav
- `Breadcrumb` for page hierarchy
- `Link` for inline navigation
- `Tabs` for sub-sections within a page
