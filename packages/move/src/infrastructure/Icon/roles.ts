// roles.ts — the single semantic icon vocabulary for the Move library.
//
// DRAFT (derived from current component usage) — for review before the refactor.
//
// Every component renders icons by ROLE (`useIcon('close')`), never by raw name.
// A role maps to a default built-in icon name; consumers can override per role on
// MoveRoot (`<MoveRoot icons={{ close: … }}>`) — semantic theming, not name-matching.
//
// The comment after each role lists the components that use it today, so the
// vocabulary stays grounded in real affordances.

export const ICON_ROLES = {
  // ── Disclosure ──────────────────────────────────────────────────────────
  expand: 'chevron-down', // Accordion, Collapsible, Select, Autocomplete (open a panel/menu)

  // ── Stepper buttons ─────────────────────────────────────────────────────
  increment: 'chevron-up', // NumberInput
  decrement: 'chevron-down', // NumberInput

  // ── Sequential navigation ───────────────────────────────────────────────
  previous: 'chevron-left', // Pagination, CalendarView, Carousel (horizontal), media players
  next: 'chevron-right', // Pagination, CalendarView, Carousel (horizontal), media players
  separator: 'chevron-right', // Breadcrumb
  // NOTE: a vertical Carousel flips previous→chevron-up / next→chevron-down.
  //       Open question: orientation-aware roles, or let the component pick.

  // ── Selection ───────────────────────────────────────────────────────────
  selected: 'check', // Select, Dropdown, Autocomplete (chosen option)
  complete: 'check', // Stepper (completed step)

  // ── Validation indicators ───────────────────────────────────────────────
  valid: 'check', // PasswordStrength requirement met; inline field validity
  invalid: 'x', // PasswordStrength requirement unmet

  // ── Dismissal (all default to 'x', kept DISTINCT so each is themeable) ───
  close: 'x', // Dialog, Drawer, Popover, Sidebar, Toast, Alert
  clear: 'x', // Autocomplete (clear the input)
  remove: 'x', // FileUpload (remove a file)

  // ── Status / feedback ───────────────────────────────────────────────────
  status: {
    info: 'info', // Alert, Toast
    success: 'circle-check', // Alert, Toast, FileUpload
    warning: 'triangle-alert', // Alert, Toast
    danger: 'circle-x', // Alert, Toast
  },

  // ── Password visibility ─────────────────────────────────────────────────
  passwordShow: 'eye', // Password
  passwordHide: 'eye-off', // Password

  // ── Media transport (Audio/Video player) ────────────────────────────────
  play: 'play',
  pause: 'pause',
  mute: 'volume-x',
  unmute: 'volume-2',
  captions: 'captions',
  settings: 'settings',
  enterFullscreen: 'maximize',
  exitFullscreen: 'minimize',

  // ── Misc affordances ────────────────────────────────────────────────────
  calendar: 'calendar', // DatePicker (open the calendar)
  eyedropper: 'pipette', // ColorInput (pick a colour)
  file: 'file', // FileUpload (file row)
  imageError: 'image-off', // Image (broken/failed image)
} as const;

export type IconRoleStatus = `status.${keyof (typeof ICON_ROLES)['status']}`;
export type IconRole = Exclude<keyof typeof ICON_ROLES, 'status'> | IconRoleStatus;

/** The default built-in icon name a role maps to (handles the nested `status.*`). */
export function roleIconName(role: IconRole): string {
  if (role.startsWith('status.')) {
    const key = role.slice(7) as keyof (typeof ICON_ROLES)['status'];
    return ICON_ROLES.status[key];
  }
  return ICON_ROLES[role as Exclude<keyof typeof ICON_ROLES, 'status'>] as string;
}
