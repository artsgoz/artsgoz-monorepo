export const GOOGLE_EMAIL_DOMAIN = 'student.chula.ac.th';

export function isAllowedGoogleEmail(
  email: string | null | undefined,
): boolean {
  return (
    typeof email === 'string' && /^[^\s@]+@student\.chula\.ac\.th$/i.test(email)
  );
}

export function validateSignIn(
  provider: string | null | undefined,
  email: string | null,
  verified: boolean,
): void {
  if (
    provider === 'google.com' &&
    (!verified || !isAllowedGoogleEmail(email))
  ) {
    throw new Error(
      'Google sign-in requires a verified @student.chula.ac.th email. Use email and password for other addresses.',
    );
  }
  if (provider !== 'google.com' && provider !== 'password')
    throw new Error('Use Google or email and password to sign in.');
}
