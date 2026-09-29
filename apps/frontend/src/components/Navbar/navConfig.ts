import { PATHS } from '../../routes/paths.js';
import type { MegaMenuCategory } from './MegaMenu.js';

export interface NavItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
  hasDropdown?: boolean;
  hasMegaMenu?: boolean;
  megaMenu?: MegaMenuCategory[];
}

export interface DropdownItem {
  /** Translation key — call t(item.label) in components to render the label. */
  label: string;
  path: string;
}

// ─── Shared column templates (matching Figma) ────────────────────────────────

/** Academic services column — EL-146ec999 template */
const ACADEMIC_COLUMN = (): MegaMenuCategory['items'] => [
  { label: 'ติดตามหน่วยกิต',       path: PATHS.CREDIT_TRACKING },
  { label: 'ใบเหลืองใบฟ้าออนไลน์', path: PATHS.YELLOW_CARD },
  { label: 'ค้นหาชื่ออาจารย์',       path: PATHS.PROFESSORS },
  { label: 'หลักสูตรจากภาคต่าง ๆ',  path: PATHS.CURRICULUM },
  { label: 'ทุนการศึกษา',            path: '#' },
  { label: 'เอกสารและแบบฟอร์ม',     path: PATHS.FORMS },
];

/** Club & articles column — EL-bc3a81e8 template */
const CLUBS_COLUMN = (): MegaMenuCategory['items'] => [
  { label: 'ชมรมทั้งหมด',                   path: PATHS.CLUBS },
  { label: 'ที่บันทึกไว้',                   path: PATHS.ARTICLES + '?tab=saved' },
  { label: 'บทความจากชมรมสาราณียกรณ์', path: PATHS.ARTICLES },
];

/** Mega-menu used for "บริการนิสิต" — five category columns per Figma */
const STUDENT_SERVICES_MEGA_MENU: MegaMenuCategory[] = [
  { label: 'บริการวิชาการ',       items: ACADEMIC_COLUMN() },
  { label: 'บริการทั่วไป',        items: CLUBS_COLUMN() },
  { label: 'บริการเรียนรู้',       items: ACADEMIC_COLUMN() },
  { label: 'บริการจากกอศ.',       items: CLUBS_COLUMN() },
  { label: 'บริการจากมหาวิทยาลัย', items: ACADEMIC_COLUMN() },
];

// ─── Nav items ────────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'navbar.home',             path: PATHS.ROOT },
  {
    label: 'navbar.student_services',
    path: PATHS.STUDENT_SERVICES,
    hasMegaMenu: true,
    megaMenu: STUDENT_SERVICES_MEGA_MENU,
  },
  { label: 'navbar.help',        path: PATHS.HELP },
  { label: 'navbar.internships', path: PATHS.INTERNSHIPS, hasDropdown: true },
  { label: 'navbar.curriculum',  path: PATHS.CURRICULUM },
];

export const DROPDOWN_ITEMS: DropdownItem[] = [
  { label: 'navbar.internships_dropdown_review', path: PATHS.INTERNSHIPS },
  { label: 'navbar.internships_dropdown_open',   path: '#' },
];
