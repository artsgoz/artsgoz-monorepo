export { auth } from '@base-components';
import { auth } from '@base-components';
export const isFirebaseConfigured = true;
export function requireAuth() {
  return auth;
}
