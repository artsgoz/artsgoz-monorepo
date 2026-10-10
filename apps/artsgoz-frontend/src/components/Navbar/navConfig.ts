import { PATHS } from '../../routes/paths.js';

export interface NavItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
  hasDropdown?: boolean;
}

export interface DropdownItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'navbar.home',             path: PATHS.ROOT },
  { label: 'navbar.about',            path: PATHS.ABOUT },
  { label: 'navbar.student_services', path: PATHS.STUDENT_SERVICES },
  { label: 'navbar.curriculum',       path: PATHS.CURRICULUM },
  { label: 'navbar.help',             path: PATHS.HELP },
  { label: 'navbar.internships',      path: PATHS.INTERNSHIPS, hasDropdown: true },
];

export const DROPDOWN_ITEMS: DropdownItem[] = [
  { label: 'navbar.internships_dropdown_review', path: PATHS.INTERNSHIPS },
  { label: 'navbar.internships_dropdown_open',   path: '#' },
];
